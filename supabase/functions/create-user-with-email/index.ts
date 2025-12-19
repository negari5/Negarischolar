import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : '';

    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
    if (!serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Missing SERVICE_ROLE_KEY secret' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    if (!jwt) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 },
      );
    }

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(jwt);
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 },
      );
    }

    let isAdminByRole = false;
    try {
      const { data: roleOk, error: roleErr } = await supabaseAdmin.rpc('has_role', {
        _user_id: userData.user.id,
        _role: 'admin',
      });
      if (!roleErr && roleOk === true) isAdminByRole = true;
    } catch {
      // Ignore role check failures and fall back to profile flags.
    }

    const { data: callerProfile, error: callerErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .maybeSingle();

    const isAdminByProfile = !!((callerProfile as any)?.is_admin || (callerProfile as any)?.is_super_admin);

    if (callerErr || !(isAdminByRole || isAdminByProfile)) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 },
      );
    }

    const { email, firstName, lastName, phone, city, userType, isAdmin } = await req.json()
    
    console.log('Creating user:', { email, firstName, lastName, userType, isAdmin });

    const fullName = `${firstName} ${lastName}`.trim();

    // Create user and send invite email (requires SMTP configured in Supabase Auth)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          user_type: userType || 'student',
        },
        redirectTo: `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/profile?tab=goals`,
      },
    );

    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    console.log('User created in auth:', authData.user?.id);

    // Upsert profile so the user shows up in AdminDashboard fetchUsers().
    // Different deployments may have different column names (account_type vs user_type, address vs city, phone_number vs phone).
    const baseProfile = {
      id: authData.user.id,
    };

    // Try the most compatible payloads first.
    const nameAttempts: Record<string, any>[] = [
      {},
      { first_name: firstName, last_name: lastName },
      { first_name: firstName },
      { last_name: lastName },
    ];

    const infoAttempts: Record<string, any>[] = [
      {},
      { email },
      { user_type: userType || 'student' },
      { account_type: userType || 'student' },
      { user_type: userType || 'student', email },
      { account_type: userType || 'student', email },
      { user_type: userType || 'student', city: city || null, phone: phone || null },
      { account_type: userType || 'student', city: city || null, phone: phone || null },
      { user_type: userType || 'student', address: city || null, phone_number: phone || null },
      { account_type: userType || 'student', address: city || null, phone_number: phone || null },
    ];

    let lastUpsertErr: any = null;
    for (const nameExtra of nameAttempts) {
      for (const infoExtra of infoAttempts) {
        const payload = { ...baseProfile, ...nameExtra, ...infoExtra };
        const { error } = await supabaseAdmin
          .from('profiles')
          .upsert(payload as any, { onConflict: 'id' });
        if (!error) {
          lastUpsertErr = null;
          break;
        }
        lastUpsertErr = error;
      }
      if (!lastUpsertErr) break;
    }

    if (lastUpsertErr) {
      console.error('Profile upsert failed:', lastUpsertErr);
      throw new Error(lastUpsertErr?.message || 'Failed to update user profile.');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User created successfully',
        userId: authData.user.id,
        email: email
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error?.message || 'Unknown error',
        details: error 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getBearerToken = (req: Request) => {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization") || "";
  const parts = auth.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") return parts[1];
  return null;
};

type DirectoryUser = {
  id: string;
  email: string;
  invited_at: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  user_type: string;
  first_name: string | null;
  last_name: string | null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const jwt = getBearerToken(req);
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Missing authorization token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? "";
    if (!serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Missing SERVICE_ROLE_KEY secret" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL") ?? "", serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userRes, error: userErr } = await supabaseAdmin.auth.getUser(jwt);
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerId = userRes.user.id;

    let isAdminByRole = false;
    try {
      const { data: ok, error: roleErr } = await supabaseAdmin.rpc("has_role", {
        _user_id: callerId,
        _role: "admin",
      });
      if (!roleErr && ok === true) isAdminByRole = true;
    } catch {
      // ignore
    }

    const { data: profileRow } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", callerId)
      .maybeSingle();

    const isAdminByProfile = !!((profileRow as any)?.is_admin || (profileRow as any)?.is_super_admin);

    if (!(isAdminByRole || isAdminByProfile)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const page = Number(body?.page ?? 1);
    const perPage = Math.min(1000, Math.max(1, Number(body?.perPage ?? 1000)));

    const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (listErr) throw listErr;

    const users = (listData?.users ?? []) as any[];

    const directory: DirectoryUser[] = users.map((u) => {
      const meta = (u.user_metadata ?? {}) as any;
      const userType =
        meta.user_type ||
        meta.userType ||
        meta.account_type ||
        meta.accountType ||
        "student";

      return {
        id: u.id,
        email: u.email ?? "",
        invited_at: u.invited_at ?? null,
        email_confirmed_at: (u.email_confirmed_at ?? u.confirmed_at ?? null) as any,
        last_sign_in_at: u.last_sign_in_at ?? null,
        created_at: u.created_at,
        user_type: userType,
        first_name: meta.first_name ?? null,
        last_name: meta.last_name ?? null,
      };
    });

    return new Response(JSON.stringify({ users: directory }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in admin-list-users function:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

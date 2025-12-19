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

type SettingInput = {
  setting_key: string;
  setting_value: string;
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

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { data: userRes, error: userErr } = await supabaseAdmin.auth.getUser(jwt);
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userRes.user.id;

    const { data: profileRow, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("is_admin, is_super_admin")
      .eq("id", userId)
      .single();

    if (profileErr) throw profileErr;

    const isAdmin = !!(profileRow?.is_admin || profileRow?.is_super_admin);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const settings = (body?.settings ?? []) as SettingInput[];

    if (!Array.isArray(settings) || settings.length === 0) {
      return new Response(JSON.stringify({ error: "Missing settings" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const keys = settings.map((s) => s.setting_key);
    const { data: existingRows, error: existingErr } = await supabaseAdmin
      .from("site_settings")
      .select("id, setting_key")
      .in("setting_key", keys);
    if (existingErr) throw existingErr;

    const idByKey = new Map<string, string>();
    (existingRows ?? []).forEach((row: any) => idByKey.set(row.setting_key, row.id));

    const payload = settings.map((s) => ({
      ...(idByKey.get(s.setting_key) ? { id: idByKey.get(s.setting_key) } : {}),
      setting_key: s.setting_key,
      setting_value: s.setting_value,
      updated_by: userId,
    }));

    const { error: upsertErr } = await supabaseAdmin
      .from("site_settings")
      .upsert(payload, { onConflict: "id" });

    if (upsertErr) throw upsertErr;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in set-site-settings function:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

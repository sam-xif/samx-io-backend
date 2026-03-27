// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

const ALLOWED_ORIGIN = "https://samx.io"

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  const origin = req.headers.get("origin")
  if (origin !== ALLOWED_ORIGIN) {
    return new Response("Forbidden", { status: 403 })
  }

  const { path, referrer, user_agent } = await req.json()

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  )

  const { data, error } = await supabase
    .from("site_visits")
    .insert({ path, referrer, user_agent })
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/log-site-visit' \
    --header 'Authorization: Bearer <anon-key>' \
    --header 'Content-Type: application/json' \
    --data '{"path":"/blog","referrer":"https://google.com","user_agent":"Mozilla/5.0"}'

*/

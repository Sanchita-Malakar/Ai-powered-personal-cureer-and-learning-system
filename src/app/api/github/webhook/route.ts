import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    // If webhook secret is not set, allow processing in dev, but log warning
    console.warn("GITHUB_WEBHOOK_SECRET not set; webhook signature verification skipped.");
    return true;
  }
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const expectedSignature = `sha256=${hmac}`;

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawPayload = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    if (!verifyWebhookSignature(rawPayload, signature)) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    const event = request.headers.get("x-github-event");
    const data = JSON.parse(rawPayload);
    const client = getSupabaseServerClient();

    if (!client) {
      return NextResponse.json({ received: true });
    }

    const installationId = data.installation?.id;

    if (event === "installation") {
      const action = data.action;

      if (action === "deleted") {
        // Installation removed by student on GitHub
        await client
          .from("github_connections")
          .update({ connection_status: "revoked", updated_at: new Date().toISOString() })
          .eq("installation_id", installationId);

        // Also clean up repositories
        const { data: conn } = await client
          .from("github_connections")
          .select("student_id")
          .eq("installation_id", installationId)
          .maybeSingle();

        if (conn?.student_id) {
          await client.from("github_repositories").delete().eq("student_id", conn.student_id);
        }
      } else if (action === "suspend") {
        await client
          .from("github_connections")
          .update({ connection_status: "suspended", updated_at: new Date().toISOString() })
          .eq("installation_id", installationId);
      } else if (action === "unsuspend") {
        await client
          .from("github_connections")
          .update({ connection_status: "connected", updated_at: new Date().toISOString() })
          .eq("installation_id", installationId);
      }
    } else if (event === "installation_repositories") {
      const action = data.action;
      const { data: conn } = await client
        .from("github_connections")
        .select("id, student_id")
        .eq("installation_id", installationId)
        .maybeSingle();

      if (conn) {
        if (action === "added" && data.repositories_added) {
          const rows = data.repositories_added.map((r: any) => ({
            student_id: conn.student_id,
            github_connection_id: conn.id,
            github_repository_id: r.id,
            owner_login: r.full_name.split("/")[0],
            repository_name: r.name,
            full_name: r.full_name,
            default_branch: "main",
            private: Boolean(r.private),
            html_url: `https://github.com/${r.full_name}`,
            updated_at: new Date().toISOString(),
          }));
          await client.from("github_repositories").upsert(rows, { onConflict: "student_id,github_repository_id" });
        } else if (action === "removed" && data.repositories_removed) {
          const removedIds = data.repositories_removed.map((r: any) => r.id);
          await client
            .from("github_repositories")
            .delete()
            .eq("student_id", conn.student_id)
            .in("github_repository_id", removedIds);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

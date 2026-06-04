import { NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/guards"
import { createAdminClient } from "@/lib/supabase/admin"
import { WHATSAPP_QUEUE_TABLE } from "@/lib/whatsapp-site-config"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const auth = await requireRoles(request, ["admin", "supervisor"])
    if ("response" in auth) {
      return auth.response
    }

    const supabase = createAdminClient()
    const { count, error } = await supabase
      .from(WHATSAPP_QUEUE_TABLE)
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")

    if (error && error.code !== "42P01") {
      console.error("[whatsapp/progress] Error reading queue status:", error)
      return NextResponse.json({ error: "تعذر قراءة حالة طابور الرسائل" }, { status: 500 })
    }

    return NextResponse.json({
      pendingCount: count || 0,
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[whatsapp/progress] Unexpected error:", error)
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 })
  }
}
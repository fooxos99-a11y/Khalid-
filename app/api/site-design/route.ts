import { NextResponse } from "next/server"
import { buildSiteDesignCssVariables, DEFAULT_SITE_DESIGN_PRESET_ID, resolveSiteDesignSelection } from "@/lib/site-design"
import { getSiteSetting } from "@/lib/site-settings"
import { SITE_DESIGN_SETTINGS_ID } from "@/lib/site-settings-constants"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const rawValue = await getSiteSetting<{ presetId?: string }>(SITE_DESIGN_SETTINGS_ID, {
      presetId: DEFAULT_SITE_DESIGN_PRESET_ID,
    })
    const resolved = resolveSiteDesignSelection(rawValue)

    return NextResponse.json({
      presetId: resolved.presetId,
      settings: resolved.settings,
      cssVariables: buildSiteDesignCssVariables(resolved.settings),
    })
  } catch (error) {
    console.error("[site-design][GET]", error)
    return NextResponse.json({ error: "تعذر تحميل تصميم الموقع" }, { status: 500 })
  }
}
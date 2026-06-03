"use client"

import { useEffect } from "react"
import { buildSiteDesignCssVariables, DEFAULT_SITE_DESIGN_PRESET_ID, SITE_DESIGN_PRESETS, SITE_DESIGN_UPDATED_EVENT, type SiteDesignSettings } from "@/lib/site-design"

type SiteDesignResponse = {
  settings?: SiteDesignSettings
}

function applySiteDesign(settings: SiteDesignSettings) {
  const root = document.documentElement
  const cssVariables = buildSiteDesignCssVariables(settings)

  for (const [name, value] of Object.entries(cssVariables)) {
    root.style.setProperty(name, value)
  }
}

export function SiteDesignApplier() {
  useEffect(() => {
    let disposed = false

    const applyLatestSiteDesign = async () => {
      try {
        const response = await fetch(`/api/site-design?t=${Date.now()}`, { cache: "no-store" })
        const data = (await response.json().catch(() => null)) as SiteDesignResponse | null

        if (!response.ok || !data?.settings || disposed) {
          throw new Error("Failed to load site design")
        }

        applySiteDesign(data.settings)
      } catch {
        if (!disposed) {
          applySiteDesign(SITE_DESIGN_PRESETS[DEFAULT_SITE_DESIGN_PRESET_ID].settings)
        }
      }
    }

    const handleSiteDesignUpdate = () => {
      void applyLatestSiteDesign()
    }

    void applyLatestSiteDesign()
    window.addEventListener(SITE_DESIGN_UPDATED_EVENT, handleSiteDesignUpdate)

    return () => {
      disposed = true
      window.removeEventListener(SITE_DESIGN_UPDATED_EVENT, handleSiteDesignUpdate)
    }
  }, [])

  return null
}
import { DEFAULT_SITE_DESIGN_SETTINGS } from "@/lib/site-settings-constants"

export type SiteDesignSettings = {
  primary: string
  primaryDark: string
  border: string
  headerBackground: string
  headerText: string
  headerBorder: string
  heading: string
  heroStart: string
  heroMid: string
  heroEnd: string
  pageGlow: string
  pageTop: string
  pageMiddle: string
  pageBottom: string
}
export const SITE_DESIGN_UPDATED_EVENT = "site-design-updated"

type SiteDesignPresetDefinition = {
  label: string
  description: string
  settings: SiteDesignSettings
}

export const SITE_DESIGN_PRESETS = {
  default: {
    label: "الحالي",
    description: "الأزرق الرسمي الحالي للموقع مع نفس التدرجات والهوية الموجودة الآن.",
    settings: DEFAULT_SITE_DESIGN_SETTINGS,
  },
  darkGreen: {
    label: "الأخضر الداكن",
    description: "نسخة خضراء داكنة بنفس أسلوب التدرج والعمق المستخدم في التصميم الحالي.",
    settings: {
      primary: "#5d7f34",
      primaryDark: "#2d4720",
      border: "#d7e4c5",
      headerBackground: "#ffffff",
      headerText: "#24371a",
      headerBorder: "#d0ddbe",
      heading: "#172312",
      heroStart: "#54772f",
      heroMid: "#42622a",
      heroEnd: "#263d1a",
      pageGlow: "#a8c77a",
      pageTop: "#eff6e7",
      pageMiddle: "#e5efda",
      pageBottom: "#ffffff",
    },
  },
  darkGold: {
    label: "الأصفر الداكن",
    description: "نسخة ذهبية داكنة تحافظ على نفس فخامة الأزرار والخلفيات والتوهج الحالي.",
    settings: {
      primary: "#c6922d",
      primaryDark: "#6f4b12",
      border: "#ecdcb4",
      headerBackground: "#ffffff",
      headerText: "#5d3f0f",
      headerBorder: "#e6d2a4",
      heading: "#34220b",
      heroStart: "#b67f1f",
      heroMid: "#916218",
      heroEnd: "#5f3f11",
      pageGlow: "#f0c566",
      pageTop: "#fbf3e1",
      pageMiddle: "#f5ead0",
      pageBottom: "#ffffff",
    },
  },
} as const satisfies Record<string, SiteDesignPresetDefinition>

export type SiteDesignPresetId = keyof typeof SITE_DESIGN_PRESETS
export const DEFAULT_SITE_DESIGN_PRESET_ID: SiteDesignPresetId = "default"

function isSiteDesignPresetId(value: unknown): value is SiteDesignPresetId {
  return typeof value === "string" && value in SITE_DESIGN_PRESETS
}

function haveSameSettings(first: SiteDesignSettings, second: SiteDesignSettings) {
  return (Object.keys(DEFAULT_SITE_DESIGN_SETTINGS) as Array<keyof SiteDesignSettings>).every(
    (key) => first[key] === second[key],
  )
}

function normalizeHexColor(value: unknown, fallback: string) {
  const normalized = String(value || "").trim()
  return /^#[0-9a-fA-F]{6}$/.test(normalized) ? normalized.toLowerCase() : fallback
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "")
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function mix(hexA: string, hexB: string, ratio: number) {
  const first = hexToRgb(hexA)
  const second = hexToRgb(hexB)
  const weight = Math.min(1, Math.max(0, ratio))
  const blend = (start: number, end: number) => Math.round(start + (end - start) * weight)

  const toHex = (value: number) => value.toString(16).padStart(2, "0")

  return `#${toHex(blend(first.r, second.r))}${toHex(blend(first.g, second.g))}${toHex(blend(first.b, second.b))}`
}

export function normalizeSiteDesignSettings(value: unknown): SiteDesignSettings {
  const source = value && typeof value === "object" ? (value as Partial<Record<keyof SiteDesignSettings, unknown>>) : {}

  return {
    primary: normalizeHexColor(source.primary, DEFAULT_SITE_DESIGN_SETTINGS.primary),
    primaryDark: normalizeHexColor(source.primaryDark, DEFAULT_SITE_DESIGN_SETTINGS.primaryDark),
    border: normalizeHexColor(source.border, DEFAULT_SITE_DESIGN_SETTINGS.border),
    headerBackground: normalizeHexColor(source.headerBackground, DEFAULT_SITE_DESIGN_SETTINGS.headerBackground),
    headerText: normalizeHexColor(source.headerText, DEFAULT_SITE_DESIGN_SETTINGS.headerText),
    headerBorder: normalizeHexColor(source.headerBorder, DEFAULT_SITE_DESIGN_SETTINGS.headerBorder),
    heading: normalizeHexColor(source.heading, DEFAULT_SITE_DESIGN_SETTINGS.heading),
    heroStart: normalizeHexColor(source.heroStart, DEFAULT_SITE_DESIGN_SETTINGS.heroStart),
    heroMid: normalizeHexColor(source.heroMid, DEFAULT_SITE_DESIGN_SETTINGS.heroMid),
    heroEnd: normalizeHexColor(source.heroEnd, DEFAULT_SITE_DESIGN_SETTINGS.heroEnd),
    pageGlow: normalizeHexColor(source.pageGlow, DEFAULT_SITE_DESIGN_SETTINGS.pageGlow),
    pageTop: normalizeHexColor(source.pageTop, DEFAULT_SITE_DESIGN_SETTINGS.pageTop),
    pageMiddle: normalizeHexColor(source.pageMiddle, DEFAULT_SITE_DESIGN_SETTINGS.pageMiddle),
    pageBottom: normalizeHexColor(source.pageBottom, DEFAULT_SITE_DESIGN_SETTINGS.pageBottom),
  }
}

export function resolveSiteDesignSelection(value: unknown) {
  const presetId = value && typeof value === "object" ? (value as { presetId?: unknown }).presetId : undefined

  if (isSiteDesignPresetId(presetId)) {
    return {
      presetId,
      settings: SITE_DESIGN_PRESETS[presetId].settings,
    }
  }

  const normalizedSettings = normalizeSiteDesignSettings(value)
  const matchedPreset = (Object.keys(SITE_DESIGN_PRESETS) as SiteDesignPresetId[]).find((candidatePresetId) => {
    return haveSameSettings(SITE_DESIGN_PRESETS[candidatePresetId].settings, normalizedSettings)
  })

  return {
    presetId: matchedPreset || DEFAULT_SITE_DESIGN_PRESET_ID,
    settings: matchedPreset ? SITE_DESIGN_PRESETS[matchedPreset].settings : normalizedSettings,
  }
}

export function buildSiteDesignCssVariables(settings: SiteDesignSettings) {
  const buttonHighlight = mix(settings.primary, "#ffffff", 0.18)
  const buttonSecondary = withAlpha(settings.primary, 0.1)
  const buttonSecondaryHover = withAlpha(settings.primary, 0.18)

  return {
    "--primary": settings.primary,
    "--border": settings.border,
    "--input": settings.border,
    "--sidebar-primary": settings.primary,
    "--sidebar-border": settings.border,
    "--challenge-primary": settings.primaryDark,
    "--challenge-secondary": settings.primary,
    "--challenge-success": settings.primaryDark,
    "--header-scrolled-accent": settings.headerText,
    "--header-scrolled-background": withAlpha(settings.headerBackground, 0.95),
    "--header-scrolled-border": settings.headerBorder,
    "--header-hover-surface": buttonSecondary,
    "--button-gradient": `linear-gradient(135deg, ${settings.primaryDark} 0%, ${settings.primary} 55%, ${buttonHighlight} 100%)`,
    "--button-shadow": withAlpha(settings.primary, 0.16),
    "--button-outline-border": withAlpha(settings.primary, 0.24),
    "--button-outline-text": settings.headerText,
    "--button-outline-hover": buttonSecondary,
    "--button-secondary-bg": buttonSecondary,
    "--button-secondary-text": settings.headerText,
    "--button-secondary-hover": buttonSecondaryHover,
    "--button-ghost-hover": buttonSecondary,
    "--button-ghost-text": settings.headerText,
    "--landing-hero": [
      `radial-gradient(circle at 50% 28%, ${withAlpha(settings.pageGlow, 0.34)} 0%, ${withAlpha(settings.pageGlow, 0.18)} 18%, transparent 38%)`,
      `radial-gradient(circle at 50% 42%, ${withAlpha(settings.primary, 0.34)} 0%, ${withAlpha(settings.primary, 0.22)} 28%, transparent 56%)`,
      `linear-gradient(180deg, ${settings.heroStart} 0%, ${settings.heroMid} 34%, ${settings.heroMid} 68%, ${settings.heroEnd} 100%)`,
    ].join(", "),
    "--landing-page": [
      `radial-gradient(circle at 50% 0%, ${withAlpha(settings.pageGlow, 0.13)} 0%, ${withAlpha(settings.pageGlow, 0.05)} 24%, transparent 52%)`,
      `linear-gradient(180deg, ${settings.pageTop} 0%, ${settings.pageMiddle} 28%, ${settings.pageBottom} 68%, #ffffff 100%)`,
    ].join(", "),
  }
}
"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteLoader } from "@/components/ui/site-loader"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import {
  buildSiteDesignCssVariables,
  DEFAULT_SITE_DESIGN_PRESET_ID,
  resolveSiteDesignSelection,
  SITE_DESIGN_PRESETS,
  SITE_DESIGN_UPDATED_EVENT,
  type SiteDesignPresetId,
  type SiteDesignSettings,
} from "@/lib/site-design"
import { SITE_DESIGN_SETTINGS_ID } from "@/lib/site-settings-constants"
import { CheckCircle2, Palette, RotateCcw, Save } from "lucide-react"

const SITE_DESIGN_PRESET_ORDER: SiteDesignPresetId[] = ["default", "darkGreen", "darkGold"]

type SiteDesignResponse = {
  presetId?: SiteDesignPresetId
  settings?: SiteDesignSettings
}

function toCssVariableStyle(settings: SiteDesignSettings) {
  return buildSiteDesignCssVariables(settings) as CSSProperties
}

function SiteDesignPresetCard({
  presetId,
  isSelected,
  isSaved,
  onSelect,
}: {
  presetId: SiteDesignPresetId
  isSelected: boolean
  isSaved: boolean
  onSelect: (presetId: SiteDesignPresetId) => void
}) {
  const preset = SITE_DESIGN_PRESETS[presetId]
  const previewStyle = toCssVariableStyle(preset.settings)

  return (
    <button
      type="button"
      onClick={() => onSelect(presetId)}
      className={`overflow-hidden rounded-[30px] border-2 text-right transition-all ${isSelected ? "border-[var(--primary)] shadow-[0_18px_44px_rgba(52,83,167,0.18)]" : "border-[var(--border)] bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] hover:border-[var(--primary)]/40 hover:shadow-[0_14px_38px_rgba(15,23,42,0.10)]"}`}
    >
      <div style={previewStyle} className="bg-[var(--landing-page)]">
        <div className="px-5 py-5 text-white" style={{ backgroundImage: previewStyle["--landing-hero"] as string }}>
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-black backdrop-blur-sm">{preset.label}</div>
            {isSaved ? (
              <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur-sm">المطبق الآن</div>
            ) : null}
          </div>

          <h3 className="mt-5 text-2xl font-black">مجمع الملك خالد</h3>
          <p className="mt-2 text-sm font-bold leading-7 text-white/82">{preset.description}</p>

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <span className="rounded-full px-4 py-2 text-xs font-black text-white shadow-[0_12px_24px_var(--button-shadow)]" style={{ background: "var(--button-gradient)" }}>
              الزر الأساسي
            </span>
            <span className="rounded-full border bg-white px-4 py-2 text-xs font-black text-[var(--button-outline-text)]" style={{ borderColor: "var(--button-outline-border)" }}>
              الزر الثانوي
            </span>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-[24px] border border-[var(--border)] bg-white p-4 shadow-[0_14px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-28 rounded-full bg-[var(--button-secondary-hover)]" />
                <div className="h-2.5 w-20 rounded-full bg-[var(--button-secondary-bg)]" />
              </div>
              <div className="h-11 w-11 rounded-2xl" style={{ background: "var(--button-gradient)" }} />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[20px] border px-4 py-3" style={{ borderColor: "var(--header-scrolled-border)", backgroundColor: "var(--header-scrolled-background)" }}>
              <div className="h-3 w-16 rounded-full bg-[var(--button-secondary-bg)]" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-14 rounded-full bg-[var(--button-secondary-hover)]" />
                <div className="h-3 w-24 rounded-full bg-[var(--button-secondary-bg)]" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[22px] border border-[var(--border)] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="text-right">
              <div className="text-xs font-bold text-[#64748b]">الألوان الأساسية</div>
              <div className="mt-1 text-sm font-black text-[var(--challenge-primary)]">تطبيق كامل للموقع</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-2xl border border-white shadow-sm" style={{ backgroundColor: preset.settings.primaryDark }} />
              <span className="h-8 w-8 rounded-2xl border border-white shadow-sm" style={{ backgroundColor: preset.settings.primary }} />
              <span className="h-8 w-8 rounded-2xl border border-white shadow-sm" style={{ backgroundColor: preset.settings.pageGlow }} />
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

export function SiteDesignContent({ displayMode = "page" }: { displayMode?: "page" | "inline" }) {
  const router = useRouter()
  const { toast } = useToast()
  const { isLoading: authLoading, isVerified: authVerified } = useAdminAuth("تصميم الموقع")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState<SiteDesignPresetId>(DEFAULT_SITE_DESIGN_PRESET_ID)
  const [savedPresetId, setSavedPresetId] = useState<SiteDesignPresetId>(DEFAULT_SITE_DESIGN_PRESET_ID)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(`/api/site-design?t=${Date.now()}`, {
          cache: "no-store",
        })
        const data = (await response.json().catch(() => ({}))) as SiteDesignResponse

        if (!response.ok) {
          throw new Error(data.error || "تعذر تحميل إعدادات تصميم الموقع")
        }

        const resolved = resolveSiteDesignSelection({ presetId: data.presetId, ...data.settings })
        setSelectedPresetId(resolved.presetId)
        setSavedPresetId(resolved.presetId)
      } catch (error) {
        toast({
          title: "خطأ",
          description: error instanceof Error ? error.message : "تعذر تحميل إعدادات التصميم",
          variant: "destructive",
        })
        setSelectedPresetId(DEFAULT_SITE_DESIGN_PRESET_ID)
        setSavedPresetId(DEFAULT_SITE_DESIGN_PRESET_ID)
      } finally {
        setIsLoading(false)
      }
    }

    void loadSettings()
  }, [toast])

  const selectedPreset = SITE_DESIGN_PRESETS[selectedPresetId]
  const hasChanges = selectedPresetId !== savedPresetId
  const heroPreviewStyle = useMemo(() => toCssVariableStyle(selectedPreset.settings), [selectedPresetId, selectedPreset.settings])

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const response = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: SITE_DESIGN_SETTINGS_ID,
          value: { presetId: selectedPresetId },
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success) {
        throw new Error(data.error || "تعذر حفظ تصميم الموقع")
      }

      setSavedPresetId(selectedPresetId)
      window.dispatchEvent(new Event(SITE_DESIGN_UPDATED_EVENT))
      router.refresh()
      toast({ title: "تم الحفظ", description: `تم تطبيق قالب ${selectedPreset.label} على الموقع بالكامل` })
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "تعذر حفظ تصميم الموقع",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setSelectedPresetId(DEFAULT_SITE_DESIGN_PRESET_ID)
  }

  if (authLoading || isLoading || !authVerified) {
    return (
      <div className={`${displayMode === "inline" ? "min-h-[60vh]" : "min-h-screen"} flex items-center justify-center bg-white`}>
        <SiteLoader size="lg" />
      </div>
    )
  }

  const content = (
    <div className="mx-auto max-w-6xl space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-right">
          <h1 className="flex items-center justify-start gap-3 text-3xl font-black text-[#1a2332] md:text-4xl">
            <Palette className="h-8 w-8 text-[var(--primary)]" />
            تصميم الموقع
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-[#64748b]">
            اختر قالبًا لونيًا كاملًا للموقع. كل خيار يغيّر الأزرار والخلفيات والعناوين والتدرجات بنفس فكرة التصميم الحالية ولكن بعائلة لونية مختلفة.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-11 rounded-2xl border-[var(--border)] bg-white px-5 text-sm font-black text-[#1a2332] hover:bg-[var(--button-outline-hover)]"
          >
            <RotateCcw className="me-2 h-4 w-4" />
            اختيار الحالي
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="h-11 rounded-2xl bg-[var(--button-gradient)] px-6 text-sm font-black text-white hover:brightness-105 disabled:opacity-70"
          >
            <Save className="me-2 h-4 w-4" />
            {isSaving ? "جاري الحفظ..." : "حفظ التصميم"}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-[30px] border-[var(--border)] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <CardContent>
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_360px]">
            <div
              className="px-6 py-8 text-white"
              style={{ backgroundImage: heroPreviewStyle["--landing-hero"] as string }}
            >
              <div className="max-w-2xl text-right">
                <div className="text-sm font-bold text-white/80">المعاينة النشطة</div>
                <h2 className="mt-3 text-3xl font-black">{selectedPreset.label}</h2>
                <p className="mt-3 max-w-xl text-sm font-bold leading-7 text-white/82">{selectedPreset.description}</p>
                <div className="mt-4 flex flex-wrap justify-end gap-3">
                  <button type="button" className="rounded-full px-5 py-2 text-sm font-black text-white shadow-[0_12px_24px_var(--button-shadow)]" style={{ background: "var(--button-gradient)" }}>
                    الزر الأساسي
                  </button>
                  <button type="button" className="rounded-full border bg-white px-5 py-2 text-sm font-black text-[var(--button-outline-text)]" style={{ borderColor: "var(--button-outline-border)" }}>
                    الزر الثانوي
                  </button>
                </div>
                <div className="mt-6 rounded-[24px] border bg-white/12 p-4 backdrop-blur-sm" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
                  <div className="text-lg font-black text-white">الهيدر</div>
                  <div className="mt-3 flex items-center justify-between rounded-[18px] border px-4 py-3" style={{ borderColor: selectedPreset.settings.headerBorder, backgroundColor: selectedPreset.settings.headerBackground }}>
                    <div className="h-9 w-9 rounded-full border" style={{ borderColor: selectedPreset.settings.border }} />
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-14 rounded-full bg-[var(--button-secondary-bg)]" />
                      <div className="h-3 w-24 rounded-full bg-[var(--button-secondary-hover)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 bg-[linear-gradient(180deg,#fbfdff_0%,#f4f8fc_100%)] p-5">
              {[
                { label: "القالب المختار", value: selectedPreset.label },
                { label: "اللون الأساسي", value: selectedPreset.settings.primary },
                { label: "التدرج الداكن", value: selectedPreset.settings.primaryDark },
                { label: "ألوان الخلفية", value: `${selectedPreset.settings.heroStart} -> ${selectedPreset.settings.heroEnd}` },
                { label: "لون العناوين", value: selectedPreset.settings.headerText },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-[20px] border border-white/80 bg-white/88 px-4 py-3 text-right shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-[#64748b]">{item.label}</div>
                    <div className="mt-1 font-mono text-sm text-[#1a2332]">{item.value}</div>
                  </div>
                  <span className="h-10 w-10 rounded-2xl border border-white" style={{ backgroundColor: item.label === "القالب المختار" ? selectedPreset.settings.primary : item.value.split(" -> ")[0] }} />
                </div>
              ))}

              <div className="rounded-[22px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-2 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-black">تطبيق كامل للموقع</span>
                </div>
                <p className="mt-2 text-sm font-bold leading-7 text-emerald-800/90">
                  عند الحفظ سيتغير شكل الأزرار والعناوين والهيدر والخلفيات العامة بنفس منطق التدرج الحالي، لكن بالقالب الذي اخترته.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        {SITE_DESIGN_PRESET_ORDER.map((presetId) => (
          <SiteDesignPresetCard
            key={presetId}
            presetId={presetId}
            isSelected={selectedPresetId === presetId}
            isSaved={savedPresetId === presetId}
            onSelect={setSelectedPresetId}
          />
        ))}
      </div>
    </div>
  )

  if (displayMode === "inline") {
    return <div className="min-h-full bg-white px-4 py-6 md:px-6 md:py-8">{content}</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="px-4 py-8 md:px-6 md:py-10">{content}</main>
      <Footer />
    </div>
  )
}

export default function SiteDesignPage() {
  return <SiteDesignContent displayMode="page" />
}
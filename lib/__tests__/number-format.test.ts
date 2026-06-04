import { describe, it, expect } from "vitest"
import { normalizeDigitsToEnglish } from "@/lib/number-format"

describe("normalizeDigitsToEnglish", () => {
  it("converts Arabic-Indic digits to English", () => {
    expect(normalizeDigitsToEnglish("٠١٢٣٤٥٦٧٨٩")).toBe("0123456789")
  })

  it("converts Eastern Arabic-Indic digits to English", () => {
    expect(normalizeDigitsToEnglish("۰۱۲۳۴۵۶۷۸۹")).toBe("0123456789")
  })

  it("leaves English digits unchanged", () => {
    expect(normalizeDigitsToEnglish("0123456789")).toBe("0123456789")
  })

  it("handles mixed Arabic and English digits", () => {
    expect(normalizeDigitsToEnglish("٥5۵")).toBe("555")
  })

  it("preserves non-digit characters", () => {
    expect(normalizeDigitsToEnglish("٩ أشخاص")).toBe("9 أشخاص")
  })

  it("handles null input", () => {
    expect(normalizeDigitsToEnglish(null)).toBe("")
  })

  it("handles undefined input", () => {
    expect(normalizeDigitsToEnglish(undefined)).toBe("")
  })

  it("handles numeric input", () => {
    expect(normalizeDigitsToEnglish(42)).toBe("42")
  })

  it("handles empty string", () => {
    expect(normalizeDigitsToEnglish("")).toBe("")
  })
})

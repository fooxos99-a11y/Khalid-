import { describe, it, expect } from "vitest"
import {
  normalizeWhatsAppPhoneNumber,
  normalizeGuardianPhoneForStorage,
  formatGuardianPhoneForDisplay,
} from "@/lib/phone-number"

describe("normalizeWhatsAppPhoneNumber", () => {
  it("converts local 05XXXXXXXX to international format", () => {
    expect(normalizeWhatsAppPhoneNumber("0512345678")).toBe("966512345678")
  })

  it("converts 5XXXXXXXX to international format", () => {
    expect(normalizeWhatsAppPhoneNumber("512345678")).toBe("966512345678")
  })

  it("strips 00 prefix and returns remaining digits", () => {
    expect(normalizeWhatsAppPhoneNumber("00966512345678")).toBe("966512345678")
  })

  it("strips non-digit characters", () => {
    expect(normalizeWhatsAppPhoneNumber("+966-51-234-5678")).toBe("966512345678")
  })

  it("returns valid international numbers as-is", () => {
    expect(normalizeWhatsAppPhoneNumber("966512345678")).toBe("966512345678")
  })

  it("throws for empty input", () => {
    expect(() => normalizeWhatsAppPhoneNumber("")).toThrow("رقم الهاتف غير صالح")
  })

  it("throws for too-short numbers", () => {
    expect(() => normalizeWhatsAppPhoneNumber("12345")).toThrow("رقم الهاتف غير صالح")
  })

  it("throws for too-long numbers", () => {
    expect(() => normalizeWhatsAppPhoneNumber("1234567890123456")).toThrow("رقم الهاتف غير صالح")
  })
})

describe("normalizeGuardianPhoneForStorage", () => {
  it("converts 9665XXXXXXXX to local 05XXXXXXXX", () => {
    expect(normalizeGuardianPhoneForStorage("966512345678")).toBe("0512345678")
  })

  it("converts 5XXXXXXXX to local 05XXXXXXXX", () => {
    expect(normalizeGuardianPhoneForStorage("512345678")).toBe("0512345678")
  })

  it("keeps 05XXXXXXXX as-is", () => {
    expect(normalizeGuardianPhoneForStorage("0512345678")).toBe("0512345678")
  })

  it("strips 00 prefix", () => {
    expect(normalizeGuardianPhoneForStorage("00966512345678")).toBe("0512345678")
  })

  it("throws for empty input", () => {
    expect(() => normalizeGuardianPhoneForStorage("")).toThrow("رقم الهاتف غير صالح")
  })

  it("throws for too-short numbers", () => {
    expect(() => normalizeGuardianPhoneForStorage("12345")).toThrow("رقم الهاتف غير صالح")
  })
})

describe("formatGuardianPhoneForDisplay", () => {
  it("returns formatted phone for valid input", () => {
    expect(formatGuardianPhoneForDisplay("966512345678")).toBe("0512345678")
  })

  it("returns dash for null", () => {
    expect(formatGuardianPhoneForDisplay(null)).toBe("-")
  })

  it("returns dash for undefined", () => {
    expect(formatGuardianPhoneForDisplay(undefined)).toBe("-")
  })

  it("returns original value for invalid phone", () => {
    expect(formatGuardianPhoneForDisplay("abc")).toBe("abc")
  })
})

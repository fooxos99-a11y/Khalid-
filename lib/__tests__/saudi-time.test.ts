import { describe, it, expect } from "vitest"
import {
  getSaudiDateString,
  getSaudiWeekdayIndex,
  formatSaudiTimeWithPeriod,
} from "@/lib/saudi-time"

describe("getSaudiDateString", () => {
  it("returns date in YYYY-MM-DD format", () => {
    const date = new Date("2024-06-15T12:00:00Z")
    const result = getSaudiDateString(date)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it("accounts for Saudi timezone (UTC+3)", () => {
    // At 22:00 UTC on June 14, it's already June 15 01:00 in Saudi Arabia
    const date = new Date("2024-06-14T22:00:00Z")
    expect(getSaudiDateString(date)).toBe("2024-06-15")
  })
})

describe("getSaudiWeekdayIndex", () => {
  it("returns a number between 0 and 6", () => {
    const result = getSaudiWeekdayIndex(new Date("2024-06-15T12:00:00Z"))
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(6)
  })

  it("returns 6 for a Saturday in Saudi time", () => {
    // June 15, 2024 is a Saturday
    const result = getSaudiWeekdayIndex(new Date("2024-06-15T12:00:00Z"))
    expect(result).toBe(6)
  })

  it("returns 0 for a Sunday in Saudi time", () => {
    // June 16, 2024 is a Sunday
    const result = getSaudiWeekdayIndex(new Date("2024-06-16T12:00:00Z"))
    expect(result).toBe(0)
  })
})

describe("formatSaudiTimeWithPeriod", () => {
  it("formats ISO date string with AM period (ص)", () => {
    const result = formatSaudiTimeWithPeriod("2024-06-15T05:30:00Z")
    // 05:30 UTC = 08:30 Saudi time (AM)
    expect(result).toBe("08:30 ص")
  })

  it("formats ISO date string with PM period (م)", () => {
    const result = formatSaudiTimeWithPeriod("2024-06-15T14:00:00Z")
    // 14:00 UTC = 17:00 Saudi time (PM)
    expect(result).toBe("05:00 م")
  })

  it("formats plain HH:MM time string", () => {
    expect(formatSaudiTimeWithPeriod("14:30")).toBe("02:30 م")
  })

  it("formats midnight as 12:00 ص", () => {
    expect(formatSaudiTimeWithPeriod("00:00")).toBe("12:00 ص")
  })

  it("formats noon as 12:00 م", () => {
    expect(formatSaudiTimeWithPeriod("12:00")).toBe("12:00 م")
  })

  it("returns original value for invalid time", () => {
    expect(formatSaudiTimeWithPeriod("invalid")).toBe("invalid")
  })
})

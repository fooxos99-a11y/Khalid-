import { describe, it, expect } from "vitest"
import {
  normalizeHafizExtraPages,
  getHafizExtraPoints,
  getHafizExtraLabel,
  HAFIZ_EXTRA_PAGE_VALUES,
} from "@/lib/hafiz-extra"

describe("normalizeHafizExtraPages", () => {
  it("returns 0.5 for valid input", () => {
    expect(normalizeHafizExtraPages(0.5)).toBe(0.5)
  })

  it("returns 1 for valid input", () => {
    expect(normalizeHafizExtraPages(1)).toBe(1)
  })

  it("returns 2 for valid input", () => {
    expect(normalizeHafizExtraPages(2)).toBe(2)
  })

  it("returns null for invalid numeric value", () => {
    expect(normalizeHafizExtraPages(3)).toBeNull()
  })

  it("handles string inputs", () => {
    expect(normalizeHafizExtraPages("1")).toBe(1)
  })

  it("returns null for non-numeric input", () => {
    expect(normalizeHafizExtraPages("abc")).toBeNull()
  })

  it("returns null for null", () => {
    expect(normalizeHafizExtraPages(null)).toBeNull()
  })

  it("returns null for undefined", () => {
    expect(normalizeHafizExtraPages(undefined)).toBeNull()
  })
})

describe("getHafizExtraPoints", () => {
  it("returns 20 points for 2 pages", () => {
    expect(getHafizExtraPoints(2)).toBe(20)
  })

  it("returns 10 points for 1 page", () => {
    expect(getHafizExtraPoints(1)).toBe(10)
  })

  it("returns 5 points for 0.5 pages", () => {
    expect(getHafizExtraPoints(0.5)).toBe(5)
  })

  it("returns 0 for invalid value", () => {
    expect(getHafizExtraPoints(99)).toBe(0)
  })

  it("returns 0 for null", () => {
    expect(getHafizExtraPoints(null)).toBe(0)
  })
})

describe("getHafizExtraLabel", () => {
  it("returns وجهان for 2 pages", () => {
    expect(getHafizExtraLabel(2)).toBe("وجهان")
  })

  it("returns وجه for 1 page", () => {
    expect(getHafizExtraLabel(1)).toBe("وجه")
  })

  it("returns نصف وجه for 0.5 pages", () => {
    expect(getHafizExtraLabel(0.5)).toBe("نصف وجه")
  })

  it("returns null for invalid value", () => {
    expect(getHafizExtraLabel(99)).toBeNull()
  })
})

describe("HAFIZ_EXTRA_PAGE_VALUES", () => {
  it("contains exactly [0.5, 1, 2]", () => {
    expect([...HAFIZ_EXTRA_PAGE_VALUES]).toEqual([0.5, 1, 2])
  })
})

import { describe, it, expect } from "vitest"
import {
  normalizeExamPortionType,
  getExamPortionLabel,
  getExamPortionCount,
  isValidExamPortionNumber,
  getJuzNumberForPortion,
  getEquivalentPortionNumbers,
  getPortionIdentity,
  getPassedPortionNumbers,
} from "@/lib/exam-portions"

describe("normalizeExamPortionType", () => {
  it("returns 'hizb' for 'hizb' input", () => {
    expect(normalizeExamPortionType("hizb")).toBe("hizb")
  })

  it("returns 'juz' for 'juz' input", () => {
    expect(normalizeExamPortionType("juz")).toBe("juz")
  })

  it("returns 'juz' for any other value", () => {
    expect(normalizeExamPortionType("other")).toBe("juz")
    expect(normalizeExamPortionType(null)).toBe("juz")
    expect(normalizeExamPortionType(undefined)).toBe("juz")
  })
})

describe("getExamPortionLabel", () => {
  it("returns juz label for juz type", () => {
    expect(getExamPortionLabel("juz", 5)).toBe("الجزء 5")
  })

  it("returns hizb label for hizb type", () => {
    expect(getExamPortionLabel("hizb", 10)).toBe("الحزب 10")
  })

  it("returns fallback when portionNumber is null", () => {
    expect(getExamPortionLabel("juz", null, "N/A")).toBe("N/A")
  })

  it("returns fallback when portionNumber is 0", () => {
    expect(getExamPortionLabel("juz", 0, "none")).toBe("none")
  })

  it("returns empty string as default fallback", () => {
    expect(getExamPortionLabel("juz", null)).toBe("")
  })
})

describe("getExamPortionCount", () => {
  it("returns 30 for juz", () => {
    expect(getExamPortionCount("juz")).toBe(30)
  })

  it("returns 60 for hizb", () => {
    expect(getExamPortionCount("hizb")).toBe(60)
  })
})

describe("isValidExamPortionNumber", () => {
  it("returns true for valid juz number (1-30)", () => {
    expect(isValidExamPortionNumber("juz", 1)).toBe(true)
    expect(isValidExamPortionNumber("juz", 30)).toBe(true)
  })

  it("returns false for out-of-range juz number", () => {
    expect(isValidExamPortionNumber("juz", 0)).toBe(false)
    expect(isValidExamPortionNumber("juz", 31)).toBe(false)
  })

  it("returns true for valid hizb number (1-60)", () => {
    expect(isValidExamPortionNumber("hizb", 1)).toBe(true)
    expect(isValidExamPortionNumber("hizb", 60)).toBe(true)
  })

  it("returns false for null/undefined", () => {
    expect(isValidExamPortionNumber("juz", null)).toBe(false)
    expect(isValidExamPortionNumber("juz", undefined)).toBe(false)
  })

  it("returns false for non-integer", () => {
    expect(isValidExamPortionNumber("juz", 1.5)).toBe(false)
  })
})

describe("getJuzNumberForPortion", () => {
  it("returns the same number for juz type", () => {
    expect(getJuzNumberForPortion("juz", 5)).toBe(5)
  })

  it("converts hizb to juz (ceiling of half)", () => {
    expect(getJuzNumberForPortion("hizb", 1)).toBe(1)
    expect(getJuzNumberForPortion("hizb", 2)).toBe(1)
    expect(getJuzNumberForPortion("hizb", 3)).toBe(2)
    expect(getJuzNumberForPortion("hizb", 4)).toBe(2)
  })

  it("returns null for null input", () => {
    expect(getJuzNumberForPortion("juz", null)).toBeNull()
  })
})

describe("getEquivalentPortionNumbers", () => {
  it("returns same number when source and target types match", () => {
    expect(getEquivalentPortionNumbers("juz", 5, "juz")).toEqual([5])
  })

  it("converts juz to two hizbs", () => {
    expect(getEquivalentPortionNumbers("juz", 3, "hizb")).toEqual([5, 6])
  })

  it("converts hizb to one juz", () => {
    expect(getEquivalentPortionNumbers("hizb", 5, "juz")).toEqual([3])
    expect(getEquivalentPortionNumbers("hizb", 6, "juz")).toEqual([3])
  })
})

describe("getPortionIdentity", () => {
  it("extracts identity from a juz record", () => {
    const record = { portion_type: "juz", portion_number: 5, juz_number: 5 }
    const identity = getPortionIdentity(record)
    expect(identity.portionType).toBe("juz")
    expect(identity.portionNumber).toBe(5)
    expect(identity.juzNumber).toBe(5)
  })

  it("falls back to juz_number when portion_number is missing", () => {
    const record = { portion_type: "hizb", portion_number: null, juz_number: 3 }
    const identity = getPortionIdentity(record)
    expect(identity.portionNumber).toBe(3)
  })
})

describe("getPassedPortionNumbers", () => {
  it("returns passed juz numbers directly", () => {
    const records = [
      { portion_type: "juz", portion_number: 1, passed: true },
      { portion_type: "juz", portion_number: 2, passed: false },
      { portion_type: "juz", portion_number: 3, passed: true },
    ]
    const passed = getPassedPortionNumbers(records, "juz")
    expect(passed.has(1)).toBe(true)
    expect(passed.has(2)).toBe(false)
    expect(passed.has(3)).toBe(true)
  })

  it("converts passed juz to hizb when targeting hizb", () => {
    const records = [{ portion_type: "juz", portion_number: 1, passed: true }]
    const passed = getPassedPortionNumbers(records, "hizb")
    expect(passed.has(1)).toBe(true)
    expect(passed.has(2)).toBe(true)
  })

  it("marks juz as passed when both hizbs are passed", () => {
    const records = [
      { portion_type: "hizb", portion_number: 1, passed: true },
      { portion_type: "hizb", portion_number: 2, passed: true },
    ]
    const passed = getPassedPortionNumbers(records, "juz")
    expect(passed.has(1)).toBe(true)
  })

  it("does not mark juz as passed when only one hizb is passed", () => {
    const records = [
      { portion_type: "hizb", portion_number: 1, passed: true },
      { portion_type: "hizb", portion_number: 2, passed: false },
    ]
    const passed = getPassedPortionNumbers(records, "juz")
    expect(passed.has(1)).toBe(false)
  })
})

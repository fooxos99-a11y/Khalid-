import { describe, it, expect } from "vitest"
import {
  formatReviewPagesLabel,
  getWeeklyDayRange,
  buildWeeklyReviewPlan,
  getWeekdayLabel,
} from "@/lib/weekly-review"

describe("formatReviewPagesLabel", () => {
  it("returns حزب for 10 pages", () => {
    expect(formatReviewPagesLabel(10)).toBe("حزب")
  })

  it("returns جزء واحد for 20 pages", () => {
    expect(formatReviewPagesLabel(20)).toBe("جزء واحد")
  })

  it("returns جزئين for 40 pages", () => {
    expect(formatReviewPagesLabel(40)).toBe("جزئين")
  })

  it("returns 3 أجزاء for 60 pages", () => {
    expect(formatReviewPagesLabel(60)).toBe("3 أجزاء")
  })

  it("returns parts count for multiples of 20", () => {
    expect(formatReviewPagesLabel(80)).toBe("4 أجزاء")
  })

  it("returns وجه suffix for other values", () => {
    expect(formatReviewPagesLabel(15)).toBe("15 وجه")
  })

  it("returns dash for 0", () => {
    expect(formatReviewPagesLabel(0)).toBe("-")
  })

  it("returns dash for null", () => {
    expect(formatReviewPagesLabel(null)).toBe("-")
  })

  it("returns dash for undefined", () => {
    expect(formatReviewPagesLabel(undefined)).toBe("-")
  })

  it("returns dash for negative values", () => {
    expect(formatReviewPagesLabel(-5)).toBe("-")
  })

  it("handles string input", () => {
    expect(formatReviewPagesLabel("20")).toBe("جزء واحد")
  })
})

describe("getWeeklyDayRange", () => {
  it("returns range from start to end (inclusive)", () => {
    expect(getWeeklyDayRange(0, 4)).toEqual([0, 1, 2, 3, 4])
  })

  it("wraps around week boundary", () => {
    expect(getWeeklyDayRange(5, 1)).toEqual([5, 6, 0, 1])
  })

  it("returns single day when start equals end", () => {
    expect(getWeeklyDayRange(3, 3)).toEqual([3])
  })

  it("returns empty array for non-integer input", () => {
    expect(getWeeklyDayRange(1.5, 3)).toEqual([])
  })

  it("returns full week when wrapping all days", () => {
    expect(getWeeklyDayRange(0, 6)).toEqual([0, 1, 2, 3, 4, 5, 6])
  })
})

describe("buildWeeklyReviewPlan", () => {
  it("distributes evenly when average >= minDailyPages", () => {
    const plan = buildWeeklyReviewPlan({
      totalPages: 100,
      minDailyPages: 10,
      startDay: 0,
      endDay: 4,
    })
    expect(plan.dailyTargetPages).toBe(20)
    expect(plan.repeatsToMeetMinimum).toBe(false)
    expect(plan.allocations).toHaveLength(5)
    expect(plan.allocations.every((a: { pages: number }) => a.pages === 20)).toBe(true)
  })

  it("uses minDailyPages when average is too low", () => {
    const plan = buildWeeklyReviewPlan({
      totalPages: 100,
      minDailyPages: 30,
      startDay: 0,
      endDay: 4,
    })
    expect(plan.dailyTargetPages).toBe(30)
    expect(plan.repeatsToMeetMinimum).toBe(true)
  })

  it("repeats totalPages when totalPages <= minDailyPages", () => {
    const plan = buildWeeklyReviewPlan({
      totalPages: 5,
      minDailyPages: 10,
      startDay: 0,
      endDay: 2,
    })
    expect(plan.dailyTargetPages).toBe(5)
    expect(plan.repeatsToMeetMinimum).toBe(true)
    expect(plan.allocations.every((a: { pages: number }) => a.pages === 5)).toBe(true)
  })

  it("returns zero plan for invalid totalPages", () => {
    const plan = buildWeeklyReviewPlan({
      totalPages: 0,
      minDailyPages: 10,
      startDay: 0,
      endDay: 4,
    })
    expect(plan.dailyTargetPages).toBe(0)
  })
})

describe("getWeekdayLabel", () => {
  it("returns الأحد for index 0", () => {
    expect(getWeekdayLabel(0)).toBe("الأحد")
  })

  it("returns الخميس for index 4", () => {
    expect(getWeekdayLabel(4)).toBe("الخميس")
  })

  it("returns empty string for invalid index", () => {
    expect(getWeekdayLabel(99)).toBe("")
  })
})

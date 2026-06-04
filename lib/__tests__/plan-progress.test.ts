import { describe, it, expect } from "vitest"
import {
  sortPlanProgressRecords,
  getCompletedMemorizationDays,
  getCompletedMemorizationRecords,
  getPendingSessionIndices,
  getScheduledSessionProgress,
} from "@/lib/plan-progress"

describe("sortPlanProgressRecords", () => {
  it("sorts records by created_at", () => {
    const records = [
      { created_at: "2024-03-02" },
      { created_at: "2024-03-01" },
      { created_at: "2024-03-03" },
    ]
    const sorted = sortPlanProgressRecords(records)
    expect(sorted.map((r: { created_at?: string }) => r.created_at)).toEqual(["2024-03-01", "2024-03-02", "2024-03-03"])
  })

  it("sorts records by date when created_at is null", () => {
    const records = [
      { date: "2024-03-02" },
      { date: "2024-03-01" },
    ]
    const sorted = sortPlanProgressRecords(records)
    expect(sorted.map((r: { date?: string }) => r.date)).toEqual(["2024-03-01", "2024-03-02"])
  })

  it("does not mutate original array", () => {
    const records = [{ created_at: "b" }, { created_at: "a" }]
    sortPlanProgressRecords(records)
    expect(records[0].created_at).toBe("b")
  })

  it("handles empty array", () => {
    expect(sortPlanProgressRecords([])).toEqual([])
  })
})

describe("getCompletedMemorizationDays", () => {
  it("returns count capped by totalSessions", () => {
    const records = [{ created_at: "a" }, { created_at: "b" }, { created_at: "c" }]
    expect(getCompletedMemorizationDays(records, 2)).toBe(2)
  })

  it("returns record length when fewer than totalSessions", () => {
    const records = [{ created_at: "a" }]
    expect(getCompletedMemorizationDays(records, 5)).toBe(1)
  })

  it("returns 0 for empty records", () => {
    expect(getCompletedMemorizationDays([], 5)).toBe(0)
  })

  it("handles 0 totalSessions", () => {
    expect(getCompletedMemorizationDays([{ created_at: "a" }], 0)).toBe(0)
  })
})

describe("getCompletedMemorizationRecords", () => {
  it("returns first N records sorted", () => {
    const records = [
      { created_at: "2024-03-03" },
      { created_at: "2024-03-01" },
      { created_at: "2024-03-02" },
    ]
    const result = getCompletedMemorizationRecords(records, 2)
    expect(result).toHaveLength(2)
    expect(result[0].created_at).toBe("2024-03-01")
    expect(result[1].created_at).toBe("2024-03-02")
  })
})

describe("getPendingSessionIndices", () => {
  it("returns indices from completedDays+1 to totalSessions", () => {
    expect(getPendingSessionIndices(5, 2)).toEqual([3, 4, 5])
  })

  it("returns empty array when all sessions completed", () => {
    expect(getPendingSessionIndices(3, 3)).toEqual([])
  })

  it("returns all indices when nothing completed", () => {
    expect(getPendingSessionIndices(3, 0)).toEqual([1, 2, 3])
  })

  it("handles 0 totalSessions", () => {
    expect(getPendingSessionIndices(0, 0)).toEqual([])
  })

  it("clamps completedDays to totalSessions", () => {
    expect(getPendingSessionIndices(3, 10)).toEqual([])
  })
})

describe("getScheduledSessionProgress", () => {
  it("identifies completed sessions by matching dates", () => {
    const records = [
      { date: "2024-03-01", created_at: "2024-03-01T10:00:00" },
      { date: "2024-03-03", created_at: "2024-03-03T10:00:00" },
    ]
    const scheduledDates = ["2024-03-01", "2024-03-02", "2024-03-03"]

    const result = getScheduledSessionProgress(records, scheduledDates)
    expect(result.completedDays).toBe(2)
    expect(result.completedSessionIndices).toEqual([1, 3])
    expect(result.pendingSessionIndices).toEqual([2])
  })

  it("returns all pending when no records match", () => {
    const records = [{ date: "2024-04-01", created_at: "2024-04-01T10:00:00" }]
    const scheduledDates = ["2024-03-01", "2024-03-02"]

    const result = getScheduledSessionProgress(records, scheduledDates)
    expect(result.completedDays).toBe(0)
    expect(result.pendingSessionIndices).toEqual([1, 2])
  })

  it("handles empty records", () => {
    const result = getScheduledSessionProgress([], ["2024-03-01"])
    expect(result.completedDays).toBe(0)
    expect(result.pendingSessionIndices).toEqual([1])
  })

  it("handles empty scheduled dates", () => {
    const result = getScheduledSessionProgress([{ date: "2024-03-01" }], [])
    expect(result.completedDays).toBe(0)
    expect(result.pendingSessionIndices).toEqual([])
  })
})

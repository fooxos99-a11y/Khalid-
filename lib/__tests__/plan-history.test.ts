import { describe, it, expect } from "vitest"
import { groupPlansByStudent, getPlanForDate } from "@/lib/plan-history"

describe("groupPlansByStudent", () => {
  it("groups plans by student_id", () => {
    const plans = [
      { student_id: "s1", start_date: "2024-03-01" },
      { student_id: "s2", start_date: "2024-03-01" },
      { student_id: "s1", start_date: "2024-03-10" },
    ]
    const grouped = groupPlansByStudent(plans)
    expect(grouped.get("s1")).toHaveLength(2)
    expect(grouped.get("s2")).toHaveLength(1)
  })

  it("sorts plans within a group by start_date", () => {
    const plans = [
      { student_id: "s1", start_date: "2024-03-10" },
      { student_id: "s1", start_date: "2024-03-01" },
    ]
    const grouped = groupPlansByStudent(plans)
    const studentPlans = grouped.get("s1")!
    expect(studentPlans[0].start_date).toBe("2024-03-01")
    expect(studentPlans[1].start_date).toBe("2024-03-10")
  })

  it("uses created_at when start_date is missing", () => {
    const plans = [
      { student_id: "s1", start_date: null, created_at: "2024-03-10T12:00:00" },
      { student_id: "s1", start_date: null, created_at: "2024-03-01T08:00:00" },
    ]
    const grouped = groupPlansByStudent(plans)
    const studentPlans = grouped.get("s1")!
    expect(studentPlans[0].created_at).toBe("2024-03-01T08:00:00")
  })

  it("skips plans with empty student_id", () => {
    const plans = [{ student_id: "", start_date: "2024-03-01" }]
    const grouped = groupPlansByStudent(plans)
    expect(grouped.size).toBe(0)
  })

  it("handles empty input", () => {
    expect(groupPlansByStudent([]).size).toBe(0)
  })
})

describe("getPlanForDate", () => {
  it("returns the last plan effective on or before the given date", () => {
    const plans = [
      { student_id: "s1", start_date: "2024-03-01" },
      { student_id: "s1", start_date: "2024-03-10" },
      { student_id: "s1", start_date: "2024-03-20" },
    ]
    expect(getPlanForDate(plans, "2024-03-15")?.start_date).toBe("2024-03-10")
  })

  it("returns null when no plan is effective before the date", () => {
    const plans = [{ student_id: "s1", start_date: "2024-04-01" }]
    expect(getPlanForDate(plans, "2024-03-15")).toBeNull()
  })

  it("returns the plan when date equals start_date", () => {
    const plans = [{ student_id: "s1", start_date: "2024-03-01" }]
    expect(getPlanForDate(plans, "2024-03-01")?.start_date).toBe("2024-03-01")
  })

  it("returns null for empty array", () => {
    expect(getPlanForDate([], "2024-03-01")).toBeNull()
  })

  it("skips plans with no effective date", () => {
    const plans = [
      { student_id: "s1", start_date: null, created_at: null },
      { student_id: "s1", start_date: "2024-03-01" },
    ]
    expect(getPlanForDate(plans, "2024-03-15")?.start_date).toBe("2024-03-01")
  })
})

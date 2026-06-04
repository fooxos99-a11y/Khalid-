import { describe, it, expect } from "vitest"
import {
  getPermissionCandidates,
  hasPermissionAccess,
  PERMISSION_FALLBACKS,
} from "@/lib/admin-permissions"

describe("getPermissionCandidates", () => {
  it("returns the required permission itself plus its fallbacks", () => {
    expect(getPermissionCandidates("إضافة طالب")).toEqual(["إضافة طالب", "إدارة الطلاب"])
  })

  it("returns only the required permission if no fallback exists", () => {
    expect(getPermissionCandidates("unknown")).toEqual(["unknown"])
  })

  it("returns fallback for report-related permissions", () => {
    expect(getPermissionCandidates("تقارير المعلمين")).toEqual(["تقارير المعلمين", "التقارير"])
  })

  it("returns fallback for game management permissions", () => {
    expect(getPermissionCandidates("إدارة صور خمن الصورة")).toEqual(["إدارة صور خمن الصورة", "إدارة الألعاب"])
  })
})

describe("hasPermissionAccess", () => {
  it("returns true when isFullAccess is true regardless of permissions", () => {
    expect(hasPermissionAccess([], "إضافة طالب", true)).toBe(true)
  })

  it("returns true when granted includes 'all'", () => {
    expect(hasPermissionAccess(["all"], "إضافة طالب")).toBe(true)
  })

  it("returns true when exact permission is granted", () => {
    expect(hasPermissionAccess(["إضافة طالب"], "إضافة طالب")).toBe(true)
  })

  it("returns true when fallback permission is granted", () => {
    expect(hasPermissionAccess(["إدارة الطلاب"], "إضافة طالب")).toBe(true)
  })

  it("returns false when no matching permission is granted", () => {
    expect(hasPermissionAccess(["التقارير"], "إضافة طالب")).toBe(false)
  })

  it("returns false for empty granted array", () => {
    expect(hasPermissionAccess([], "إضافة طالب")).toBe(false)
  })
})

describe("PERMISSION_FALLBACKS", () => {
  it("maps student-related permissions to إدارة الطلاب", () => {
    const studentPermissions = [
      "إضافة طالب",
      "إضافة جماعية",
      "إزالة طالب",
      "نقل طالب",
      "تعديل بيانات الطالب",
      "سجلات الطلاب",
      "إنجازات الطلاب",
      "خطط الطلاب",
    ]
    for (const perm of studentPermissions) {
      expect(PERMISSION_FALLBACKS[perm]).toEqual(["إدارة الطلاب"])
    }
  })
})

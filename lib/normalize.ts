export function normalizeCircleName(value: unknown) {
  return String(value || "").trim()
}

export function normalizeHalaqah(value?: string | null) {
  return String(value || "").trim().toLowerCase()
}

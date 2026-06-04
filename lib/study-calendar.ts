function normalizeDate(dateValue: Date | string) {
  const date = typeof dateValue === "string" ? new Date(`${dateValue}T00:00:00`) : new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function isStudyDay(dateValue: Date | string) {
  const day = normalizeDate(dateValue).getDay();
  return day !== 5 && day !== 6;
}

export function getStudyWeekStart(anchor: Date | string = new Date()) {
  const normalizedAnchor = normalizeDate(anchor);
  const start = new Date(normalizedAnchor);
  start.setDate(normalizedAnchor.getDate() - normalizedAnchor.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
}

export function getStudyWeekEnd(anchor: Date | string = new Date()) {
  const normalizedAnchor = normalizeDate(anchor);
  const end = new Date(normalizedAnchor);

  if (!isStudyDay(normalizedAnchor)) {
    const start = getStudyWeekStart(normalizedAnchor);
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 4);
  }

  end.setHours(23, 59, 59, 999);
  return end;
}

export type DateFilter = "today" | "currentWeek" | "currentMonth" | "currentSemester" | "all" | "custom"

export type CustomDateRange = {
  start: string
  end: string
}

export function countStudyDaysInRange(start: Date, end: Date) {
  const cursor = new Date(start)
  cursor.setHours(0, 0, 0, 0)

  const normalizedEnd = new Date(end)
  normalizedEnd.setHours(0, 0, 0, 0)

  let count = 0
  while (cursor <= normalizedEnd) {
    if (isStudyDay(cursor)) {
      count += 1
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return count
}

export function getStudyDatesInRange(start: Date, end: Date, formatDate: (d: Date) => string) {
  const cursor = new Date(start)
  cursor.setHours(0, 0, 0, 0)

  const normalizedEnd = new Date(end)
  normalizedEnd.setHours(0, 0, 0, 0)

  const studyDates: string[] = []
  while (cursor <= normalizedEnd) {
    if (isStudyDay(cursor)) {
      studyDates.push(formatDate(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return studyDates
}

export function getDateRange(filter: DateFilter, customRange: CustomDateRange) {
  const end = new Date()
  const start = new Date()

  if (filter === "today") {
    return { start: new Date(start.setHours(0, 0, 0, 0)), end }
  }

  if (filter === "currentWeek") {
    return { start: getStudyWeekStart(), end: getStudyWeekEnd() }
  }

  if (filter === "currentMonth") {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    return { start, end }
  }

  if (filter === "custom") {
    return {
      start: new Date(`${customRange.start}T00:00:00`),
      end: new Date(`${customRange.end}T23:59:59`),
    }
  }

  start.setFullYear(2020, 0, 1)
  return { start, end }
}
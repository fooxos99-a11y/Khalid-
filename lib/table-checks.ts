function getMessageString(error: unknown) {
  return String((error as { message?: string } | null)?.message || error || "")
}

export function isMissingTable(error: unknown, tableName: string) {
  const message = getMessageString(error)
  return new RegExp(tableName, "i").test(message) && /does not exist|not exist|relation|table/i.test(message)
}

export function isMissingStudentExamsTable(error: unknown) {
  return isMissingTable(error, "student_exams")
}

export function isMissingStudentHafizExtrasTable(error: unknown) {
  return isMissingTable(error, "student_hafiz_extras")
}

export function isMissingExamPortionColumns(error: unknown) {
  const message = getMessageString(error)
  return /portion_type|portion_number/i.test(message) && /column|does not exist|schema cache/i.test(message)
}

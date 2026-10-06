import { v } from '@l2beat/validate'

const HEX_DIGITS = '0123456789abcdef'

const ObjectId = v
  .string()
  .check((value) => isHex(value, [12]), 'Expected a short object id')

const Commit = v
  .string()
  .check((value) => isHex(value, [40, 64]), 'Expected a full commit id')

const UnixSeconds = v
  .number()
  .check((value) => Number.isInteger(value) && value > 0, 'Expected seconds')

const AuditIndexReport = v.object({
  collections: v.array(v.string()),
  title: v.string(),
  auditor: v.string(),
  date: v.union([v.string(), v.null()]),
})
export type AuditIndexReport = v.infer<typeof AuditIndexReport>

const AuditIndexSnapshot = v.object({
  timestamp: UnixSeconds,
  files: v.record(v.string(), ObjectId),
  audits: v.record(v.string(), v.record(v.string(), v.array(v.string()))),
})
export type AuditIndexSnapshot = v.infer<typeof AuditIndexSnapshot>

export const AuditIndex = v.object({
  schema_version: v.literal('1.0.0'),
  reports: v.record(v.string(), AuditIndexReport),
  repositories: v.record(v.string(), v.record(Commit, AuditIndexSnapshot)),
})
export type AuditIndex = v.infer<typeof AuditIndex>

export function covers(scopePath: string, filePath: string): boolean {
  return filePath === scopePath || filePath.startsWith(`${scopePath}/`)
}

function isHex(value: string, lengths: number[]): boolean {
  if (!lengths.includes(value.length)) {
    return false
  }
  return [...value].every((char) => HEX_DIGITS.includes(char))
}

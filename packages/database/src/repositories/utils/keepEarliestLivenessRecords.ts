interface LivenessEventRecord {
  configurationId: string
  eventId: string
  timestamp: number
  blockNumber: number
}

export function keepEarliestLivenessRecords<T extends LivenessEventRecord>(
  records: T[],
): T[] {
  const earliest = new Map<string, T>()

  for (const record of records) {
    const key = JSON.stringify([record.configurationId, record.eventId])
    const current = earliest.get(key)

    if (current === undefined || isEarlier(record, current)) {
      earliest.set(key, record)
    }
  }

  return [...earliest.values()]
}

function isEarlier(a: LivenessEventRecord, b: LivenessEventRecord): boolean {
  return (
    a.timestamp < b.timestamp ||
    (a.timestamp === b.timestamp && a.blockNumber < b.blockNumber)
  )
}

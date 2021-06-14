interface L2Data {
  TVL: number
  data: DateEntry[]
  l2s: {
    [name: string]: L2Entry
  }
}

interface L2Entry {
  TVL: number
  data: DateEntry[]
}

interface DateEntry {
  date: string
  usd: number
}

declare const l2Data: L2Data
export = l2Data

import { v } from '@l2beat/validate'
import knownNamesJson from '../knownNames.json'

export interface KnownNames {
  contracts: Map<string, string>
  methods: Map<string, string>
  implementations: Map<string, string>
}

const Entries = v.array(v.tuple([v.string(), v.string()]))
const KnownNamesJson = v.object({
  CONTRACTS: Entries,
  METHODS: Entries,
  IMPLEMENTATIONS: Entries,
})

export function loadKnownNames(): KnownNames {
  const parsed = KnownNamesJson.parse(knownNamesJson)
  return {
    contracts: new Map(parsed.CONTRACTS),
    methods: new Map(parsed.METHODS),
    implementations: new Map(parsed.IMPLEMENTATIONS),
  }
}

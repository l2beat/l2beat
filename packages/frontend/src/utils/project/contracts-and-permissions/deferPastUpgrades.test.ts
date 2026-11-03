import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { PastUpgradesData } from '~/components/projects/sections/PastUpgradesDialog'
import { deferPastUpgrades } from './deferPastUpgrades'

// Method: build an entry shaped like the project page's sections (a
// governance list, a contract list, and the same contract again under
// permissions), defer it, then check what the page keeps and what the JSON
// route serves.
describe(deferPastUpgrades.name, () => {
  const SRC = '/layer2s/projects/arbitrum/past-upgrades.json'

  it('keeps the stats and points each dialog at its list', () => {
    const { value, upgrades } = deferPastUpgrades(ENTRY, SRC)

    expect(value.sections[0]?.props.pastUpgrades).toEqual({
      stats: GOVERNANCE.stats,
      upgrades: [],
      deferred: { src: SRC, key: 'project', length: 2 },
    })
    expect(
      value.sections[1]?.props.contracts?.Ethereum?.[0]?.pastUpgrades?.deferred,
    ).toEqual({ src: SRC, key: 'Ethereum:0xBridge', length: 1 })
    expect(upgrades.project).toEqual(GOVERNANCE.upgrades)
    expect(upgrades['Ethereum:0xBridge']).toEqual(BRIDGE.upgrades)
  })

  it('keys a contract listed twice apart', () => {
    const { upgrades } = deferPastUpgrades(ENTRY, SRC)

    expect(Object.keys(upgrades)).toEqual([
      'project',
      'Ethereum:0xBridge',
      'Ethereum:0xBridge#2',
    ])
  })

  it('leaves the entry it was given untouched', () => {
    deferPastUpgrades(ENTRY, SRC)

    expect(ENTRY.sections[0]?.props.pastUpgrades).toEqual(GOVERNANCE)
  })
})

function upgrade(hash: string): PastUpgradesData['upgrades'][number] {
  return {
    isInitialDeployment: false,
    timestamp: UnixTime(1700000000),
    transactionHash: { hash, href: `https://etherscan.io/tx/${hash}` },
    implementations: [],
  }
}

const STATS = { count: 1, avgInterval: null, lastInterval: null }
const GOVERNANCE: PastUpgradesData = {
  upgrades: [upgrade('0x01'), upgrade('0x02')],
  stats: STATS,
}
const BRIDGE: PastUpgradesData = { upgrades: [upgrade('0x03')], stats: STATS }
const BRIDGE_CONTRACT = {
  id: 'Bridge',
  chain: 'Ethereum',
  addresses: [{ address: '0xBridge' }],
  pastUpgrades: BRIDGE,
}

const ENTRY: {
  sections: {
    props: {
      pastUpgrades?: PastUpgradesData
      contracts?: Record<string, (typeof BRIDGE_CONTRACT)[]>
    }
  }[]
} = {
  sections: [
    { props: { pastUpgrades: GOVERNANCE } },
    { props: { contracts: { Ethereum: [BRIDGE_CONTRACT] } } },
    { props: { contracts: { Ethereum: [BRIDGE_CONTRACT] } } },
  ],
}

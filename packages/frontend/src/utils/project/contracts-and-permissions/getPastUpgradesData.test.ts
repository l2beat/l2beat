import type { ProjectContracts } from '@l2beat/config'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  getPastUpgradesData,
  getProjectPastUpgrades,
} from './getPastUpgradesData'

describe(getProjectPastUpgrades.name, () => {
  it('keeps distinct same-transaction upgrades for the same proxy', () => {
    const contracts: ProjectContracts = {
      addresses: {
        ethereum: [
          {
            address: ChainSpecificAddress(
              'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
            ),
            isVerified: true,
            chain: 'ethereum',
            name: 'Inbox',
            url: 'https://etherscan.io/address/0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f#code',
            pastUpgrades: [
              {
                timestamp: UnixTime(1776742007),
                transactionHash:
                  '0x079984c56c5670108f5c6f664904178f9b364340351949a42e4637d1f645f770',
                implementations: [
                  ChainSpecificAddress(
                    'eth:0x980D1F93FC5809c828539c46084801673FA6A859',
                  ),
                ],
              },
              {
                timestamp: UnixTime(1776742007),
                transactionHash:
                  '0x079984c56c5670108f5c6f664904178f9b364340351949a42e4637d1f645f770',
                implementations: [
                  ChainSpecificAddress(
                    'eth:0x7C058ad1D0Ee415f7e7f30e62DB1BCf568470a10',
                  ),
                ],
              },
            ],
          },
        ],
      },
      risks: [],
    }

    const result = getPastUpgradesData(getProjectPastUpgrades(contracts))

    expect(result?.upgrades.length).toEqual(2)
    expect(result?.upgrades.map((x) => x.implementations[0]?.address)).toEqual([
      '0x980D1F93FC5809c828539c46084801673FA6A859',
      '0x7C058ad1D0Ee415f7e7f30e62DB1BCf568470a10',
    ])
  })

  it('still deduplicates exact duplicate entries', () => {
    const duplicateUpgrade = {
      timestamp: UnixTime(1739368811),
      transactionHash:
        '0xe9788a104f8443b5900e54f8c887f0522d121487fc343a1ff90e1e6ed987967e',
      implementations: [
        ChainSpecificAddress('eth:0x7C058ad1D0Ee415f7e7f30e62DB1BCf568470a10'),
      ],
    }

    const contracts: ProjectContracts = {
      addresses: {
        ethereum: [
          {
            address: ChainSpecificAddress(
              'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
            ),
            isVerified: true,
            chain: 'ethereum',
            name: 'Inbox',
            url: 'https://etherscan.io/address/0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f#code',
            pastUpgrades: [duplicateUpgrade, duplicateUpgrade],
          },
        ],
      },
      risks: [],
    }

    const result = getPastUpgradesData(getProjectPastUpgrades(contracts))

    expect(result?.upgrades.length).toEqual(1)
  })
})

import type { ProjectLiquidStakingOperators } from '@l2beat/config'
import { expect } from 'earl'
import {
  getLargestOperator,
  getLiquidStakingOperators,
} from './getLiquidStakingOperators'

describe(getLiquidStakingOperators.name, () => {
  const snapshot: ProjectLiquidStakingOperators = {
    slot: 100,
    timestamp: 1_700_000_000,
    totalEth: 1000,
    eth: 200,
    validators: 6,
    operatorCount: 12,
    operators: [
      { name: 'Kiln', eth: 120, validators: 3 },
      {
        name: '0x1234567890abcdef1234567890abcdef12345678',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        eth: 50,
        validators: 2,
      },
      { name: 'Other operators', eth: 30, validators: 1, operatorCount: 10 },
    ],
  }

  it('gives each operator its part of the protocol and of all staked ETH', () => {
    const result = getLiquidStakingOperators(snapshot)

    expect(result?.timestamp).toEqual(1_700_000_000)
    expect(result?.operatorCount).toEqual(12)
    expect(result?.operators[0]).toEqual({
      name: 'Kiln',
      eth: 120,
      validators: 3,
      protocolShare: 0.6,
      stakedEthShare: 0.12,
    })
    expect(result?.operators[2]?.operatorCount).toEqual(10)
  })

  it('shortens an operator known only by its address', () => {
    const result = getLiquidStakingOperators(snapshot)

    expect(result?.operators[1]?.name).not.toEqual(snapshot.operators[1]?.name)
    expect(result?.operators[1]?.name.startsWith('0x1234')).toEqual(true)
  })

  it('gives nothing for a protocol with no stake read', () => {
    expect(getLiquidStakingOperators(undefined)).toEqual(undefined)
    expect(getLiquidStakingOperators({ ...snapshot, eth: 0 })).toEqual(
      undefined,
    )
  })
})

describe(getLargestOperator.name, () => {
  it('skips rows that sum several operators', () => {
    const operators = getLiquidStakingOperators({
      slot: 1,
      timestamp: 1,
      totalEth: 100,
      eth: 50,
      validators: 3,
      operatorCount: 20,
      operators: [
        {
          name: 'Community Staking Module',
          eth: 30,
          validators: 1,
          operatorCount: 18,
        },
        { name: 'Kiln', eth: 15, validators: 1 },
        { name: 'Figment', eth: 5, validators: 1 },
      ],
    })?.operators

    expect(getLargestOperator(operators ?? [])?.name).toEqual('Kiln')
  })
})

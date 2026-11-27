import type { ProjectLiquidStakingOperators } from '@l2beat/config'
import { expect } from 'earl'
import {
  formatOperatorUnit,
  getLargestCompany,
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
    unit: 'account',
    operators: [
      { name: 'Kiln', eth: 100, validators: 3 },
      {
        name: 'InfStones',
        address: '0x1111111111111111111111111111111111111111',
        nameSource: 'ssv',
        eth: 20,
        validators: 1,
      },
      {
        name: '0x1234567890abcdef1234567890abcdef12345678',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        eth: 50,
        validators: 1,
      },
      {
        name: 'Other operator accounts',
        eth: 30,
        validators: 1,
        operatorCount: 9,
        rest: true,
      },
    ],
  }

  it('gives each operator its part of the protocol and of all staked ETH', () => {
    const result = getLiquidStakingOperators(snapshot)

    expect(result?.timestamp).toEqual(1_700_000_000)
    expect(result?.stakedEthShare ?? 0).toBeCloseTo(0.2, 1e-9)
    expect(result?.operatorCount).toEqual(12)
    expect(result?.unit).toEqual('account')
    expect(result?.operators[0]).toEqual({
      name: 'Kiln',
      named: true,
      eth: 100,
      validators: 3,
      protocolShare: 0.5,
      stakedEthShare: 0.1,
    })
    expect(result?.operators[3]?.operatorCount).toEqual(9)
    expect(result?.operators[3]?.rest).toEqual(true)
  })

  it('keeps a name the operator gave itself, with its source', () => {
    const operator = getLiquidStakingOperators(snapshot)?.operators[1]

    expect(operator?.name).toEqual('InfStones')
    expect(operator?.named).toEqual(true)
    expect(operator?.nameSource).toEqual('ssv')
  })

  it('shortens an operator known only by its address', () => {
    const operator = getLiquidStakingOperators(snapshot)?.operators[2]

    expect(operator?.named).toEqual(false)
    expect(operator?.name).not.toEqual(snapshot.operators[2]?.name)
    expect(operator?.name.startsWith('0x1234')).toEqual(true)
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
      unit: 'operator',
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

describe(getLargestCompany.name, () => {
  const protocol = (
    unit: ProjectLiquidStakingOperators['unit'],
    operators: ProjectLiquidStakingOperators['operators'],
  ) => {
    const result = getLiquidStakingOperators({
      slot: 1,
      timestamp: 1,
      totalEth: 1000,
      eth: operators.reduce((sum, o) => sum + o.eth, 0),
      validators: operators.length,
      operatorCount: operators.length,
      unit,
      operators,
    })
    if (!result) throw new Error('no operators')
    return result
  }

  it('adds up a company that runs for several protocols', () => {
    const largest = getLargestCompany([
      {
        name: 'Lido',
        operators: protocol('operator', [
          { name: 'RockLogic', eth: 66, validators: 1 },
          { name: 'InfStones', eth: 55, validators: 1 },
        ]),
      },
      {
        name: 'ether.fi',
        operators: protocol('account', [
          {
            name: 'InfStones',
            address: '0x1111111111111111111111111111111111111111',
            nameSource: 'ssv',
            eth: 36,
            validators: 1,
          },
        ]),
      },
    ])

    expect(largest?.name).toEqual('InfStones')
    expect(largest?.stakedEthShare ?? 0).toBeCloseTo(0.091, 1e-9)
    expect(largest?.protocols).toEqual(['Lido', 'ether.fi'])
  })

  it('leaves out vaults, groups and rows known only by address', () => {
    const largest = getLargestCompany([
      {
        name: 'StakeWise',
        operators: protocol('vault', [
          { name: 'Genesis Vault', eth: 500, validators: 1 },
        ]),
      },
      {
        name: 'Lido',
        operators: protocol('operator', [
          {
            name: 'Community Staking Module',
            eth: 400,
            validators: 1,
            operatorCount: 400,
          },
          { name: 'Kiln', eth: 10, validators: 1 },
        ]),
      },
      {
        name: 'ether.fi',
        operators: protocol('account', [
          {
            name: '0x2222222222222222222222222222222222222222',
            address: '0x2222222222222222222222222222222222222222',
            eth: 300,
            validators: 1,
          },
        ]),
      },
    ])

    expect(largest?.name).toEqual('Kiln')
  })
})

describe(formatOperatorUnit.name, () => {
  it('names what a row stands for', () => {
    expect(formatOperatorUnit('node', 1)).toEqual('1 node')
    expect(formatOperatorUnit('node', 1339)).toEqual('1,339 nodes')
    expect(formatOperatorUnit('account', 15)).toEqual('15 operator accounts')
  })
})

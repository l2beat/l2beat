import { providers } from 'ethers'

import { getRoleAdmin, getRoleMembers } from '../../../common/accessControl'
import { Timelock__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

const DEPLOYED_AT = 13105394

export async function getTimelock(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const timelock = Timelock__factory.connect(addresses.timelock, provider)

  const DEFAULT_ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE()
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE()
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE()
  const TIMELOCK_ADMIN_ROLE = await timelock.TIMELOCK_ADMIN_ROLE()
  const minDelaySeconds = (await timelock.getMinDelay()).toNumber()

  const timelockAdmins = await getRoleMembers(
    provider,
    addresses.timelock,
    DEPLOYED_AT,
    TIMELOCK_ADMIN_ROLE,
  )

  const defaultAdmins = await getRoleMembers(
    provider,
    addresses.timelock,
    DEPLOYED_AT,
    DEFAULT_ADMIN_ROLE,
  )
  const executors = await getRoleMembers(
    provider,
    addresses.timelock,
    DEPLOYED_AT,
    EXECUTOR_ROLE,
  )
  const proposers = await getRoleMembers(
    provider,
    addresses.timelock,
    DEPLOYED_AT,
    PROPOSER_ROLE,
  )

  const admin = await getRoleAdmin(
    provider,
    addresses.timelock,
    TIMELOCK_ADMIN_ROLE,
  )

  return {
    name: 'Timelock',
    address: timelock.address,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      DEFAULT_ADMIN_ROLE,
      EXECUTOR_ROLE,
      PROPOSER_ROLE,
      TIMELOCK_ADMIN_ROLE,
      minDelaySeconds,
      timelockAdmins: timelockAdmins.map((t) => t.toString()),
      defaultAdmins: defaultAdmins.map((t) => t.toString()),
      executors: executors.map((t) => t.toString()),
      proposers: proposers.map((t) => t.toString()),
    },
  }
}

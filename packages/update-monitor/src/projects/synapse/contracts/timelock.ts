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

  const timelockAdminRoleAdmin = await getRoleAdmin(
    provider,
    addresses.timelock,
    TIMELOCK_ADMIN_ROLE,
  )

  const defaultAdminRoleAdmin = await getRoleAdmin(
    provider,
    addresses.timelock,
    DEFAULT_ADMIN_ROLE,
  )

  const proposerRoleAdmin = await getRoleAdmin(
    provider,
    addresses.timelock,
    PROPOSER_ROLE,
  )

  const executorRoleAdmin = await getRoleAdmin(
    provider,
    addresses.timelock,
    EXECUTOR_ROLE,
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
      timelockAdmins,
      defaultAdmins,
      executors,
      proposers,
      timelockAdminRoleAdmin,
      defaultAdminRoleAdmin,
      proposerRoleAdmin,
      executorRoleAdmin,
    },
  }
}

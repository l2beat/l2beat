import { providers } from 'ethers'

import { Timelock__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getTimelock(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const timelock = Timelock__factory.connect(addresses.timelock, provider)

  const DEFAULT_ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE()
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE()
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE()
  const TIMELOCK_ADMIN_ROLE = await timelock.TIMELOCK_ADMIN_ROLE()
  const minDelay = (await timelock.getMinDelay()).toNumber()

  const isMultisigAdmin = await timelock.hasRole(
    TIMELOCK_ADMIN_ROLE,
    addresses.multisig,
  )
  const isMultisigExecutor = await timelock.hasRole(
    EXECUTOR_ROLE,
    addresses.multisig,
  )
  const isMultisigProposer = await timelock.hasRole(
    PROPOSER_ROLE,
    addresses.multisig
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
      minDelay,
      isMultisigAdmin,
      isMultisigExecutor,
      isMultisigProposer
    },
  }
}

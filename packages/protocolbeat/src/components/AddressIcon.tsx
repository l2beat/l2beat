import clsx from 'clsx'
import type { ApiAddressType } from '../api/types'
import { IconContract } from '../icons/IconContract'
import { IconContractUnverified } from '../icons/IconContractUnverified'
import { IconDiamond } from '../icons/IconDiamond'
import { IconEoa } from '../icons/IconEoa'
import { IconEoaPermissioned } from '../icons/IconEoaPermissioned'
import { IconMultisig } from '../icons/IconMultisig'
import { IconTimelock } from '../icons/IconTimelock'
import { IconToken } from '../icons/IconToken'
import { IconUntemplatized } from '../icons/IconUntemplatized'

export function AddressIcon(props: {
  type: ApiAddressType
  className?: string
}) {
  const Icon = {
    EOA: IconEoa,
    EOAPermissioned: IconEoaPermissioned,
    Unverified: IconContractUnverified,
    Token: IconToken,
    Multisig: IconMultisig,
    Timelock: IconTimelock,
    Diamond: IconDiamond,
    Untemplatized: IconUntemplatized,
    Contract: IconContract,
    Unknown: IconContractUnverified,
  }[props.type]

  return (
    <Icon
      className={clsx(
        props.className,
        props.type === 'Unverified' && 'text-aux-red',
      )}
    />
  )
}

import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import {
  AccessControlHandler,
  type AccessControlHandlerDefinition,
} from './AccessControlHandler'

export type YieldFiMintersDefinition = v.infer<typeof YieldFiMintersDefinition>
export const YieldFiMintersDefinition = v.strictObject({
  type: v.literal('YieldFiMinters'),
  permissionlessMinting: v.boolean().optional(),
  mintingWithPermit: v.boolean().optional(),
})

export class YieldFiMintersHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: YieldFiMintersDefinition,
    readonly abi: string[],
  ) {}

  async execute(
    provider: IProvider,
    token: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const administrator = await provider.callMethod<EthereumAddress>(
      token,
      'function administrator() view returns (address)',
      [],
    )

    assert(administrator)

    const chainSpecificAdmin = ChainSpecificAddress.fromLong(
      'ethereum',
      administrator,
    )

    const minters = new Set<ChainSpecificAddress>()

    const mintersAndRedeemers = await this.extractAccessControlMembers(
      provider,
      chainSpecificAdmin,
      'MINTER_AND_REDEEMER',
    )

    for (const member of mintersAndRedeemers) {
      minters.add(member)
    }

    for (const orRole of ['BRIDGE_ROLE', 'LOCKBOX_ROLE', 'YIELD_ROLE']) {
      const members = await this.extractAccessControlMembers(
        provider,
        chainSpecificAdmin,
        orRole,
      )

      for (const member of members) {
        minters.add(member)
      }
    }

    return {
      field: '$minters',
      value: {
        members: Array.from(minters),
        permissionlessMinting: this.definition.permissionlessMinting,
        mintingWithPermit: this.definition.mintingWithPermit,
      },
    }
  }

  private async extractAccessControlMembers(
    provider: IProvider,
    address: ChainSpecificAddress,
    roleToPick: string,
  ) {
    const definition: AccessControlHandlerDefinition = {
      type: 'accessControl',
      roleNames: YieldFiRoles,
      pickRoleMembers: roleToPick,
    }

    try {
      const handler = new AccessControlHandler(this.field, definition, this.abi)
      const result = await handler.execute(provider, address)
      return result.value as ChainSpecificAddress[]
    } catch {
      return []
    }
  }
}

const YieldFiRoles = {
  '0xdf8b4c520ffe197c5343c6f5aec59570151ef9a492f2c624fd45ddde6135ec42': 'ADMIN',
  '0x196445be8e29cb4e505699c67ec8eceb0187441d0913818e000a48d538545d14':
    'MINTER_AND_REDEEMER',
  '0x413cc8bb35fe129dacd3dfaae80d6d4c5d313f64cee9dd6712e7ca52e38573a9':
    'COLLATERAL_MANAGER',
  '0x5a8bfb9223d93ad39e310233fff7bc65227887789e6e83c62b12f0dfdd782ec3':
    'REWARDER',
  '0xaf290d8680820aad922855f39b306097b20e28774d6c1ad35a20325630c3a02c':
    'MANAGER',
  '0x08fb31c3e81624356c3314088aa971b73bcc82d22bc3e3b184b4593077ae3278':
    'BRIDGE',
  '0x3812cb515c4c47772b5b6b50b84b6a856abab98cf24bcfb67a83510fb661c133': 'BOND',
  '0x0f2a9aa9ac2639d8d73bfa84d0682d3e88d5f473437d4e7c341378f9bbebddbd':
    'LOCKBOX',
  '0xaeed4774a6ca7dc9eef4423038c2a3abe132048336feddd81b2e9a5e941eb777': 'YIELD',
}

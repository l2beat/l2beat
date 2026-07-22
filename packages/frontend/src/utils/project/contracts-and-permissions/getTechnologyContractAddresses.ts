import type { ProjectContract } from '@l2beat/config'
import { ChainSpecificAddress, formatAddress } from '@l2beat/shared-pure'
import type { TechnologyContractAddress } from '~/components/projects/sections/ContractEntry'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { toVerificationStatus } from './toVerificationStatus'

export function getTechnologyContractAddresses(
  contract: ProjectContract,
  projectChangeReport: ProjectsChangeReport['projects'][string] | undefined,
): {
  addresses: TechnologyContractAddress[]
  admins: TechnologyContractAddress[]
} {
  const toAddress = (
    address: ChainSpecificAddress,
    isVerified: boolean | undefined,
    options?: {
      name?: string
      contractType?: TechnologyContractAddress['contractType']
    },
  ): TechnologyContractAddress => {
    const ethereumAddress = ChainSpecificAddress.address(address)
    const becameVerified =
      projectChangeReport?.[contract.chain]?.becameVerified.includes(
        ethereumAddress,
      )

    return {
      name: options?.name ?? formatAddress(ethereumAddress),
      address: ethereumAddress,
      verificationStatus: toVerificationStatus(isVerified, becameVerified),
      href: getExplorerAddressUrl(contract.url, ethereumAddress),
      contractType: options?.contractType,
    }
  }

  const implementations = contract.upgradeability?.implementations ?? []
  const addresses = [
    toAddress(contract.address, contract.isVerified, {
      contractType:
        contract.upgradeability && !contract.upgradeability.immutable
          ? 'proxy'
          : 'standalone',
    }),
    ...implementations.map((implementation, index) => {
      const suffix = implementations.length > 1 ? ` #${index + 1}` : ''
      const upgradeable = contract.upgradeability?.immutable
        ? ''
        : ' (Upgradable)'

      return toAddress(implementation.address, implementation.isVerified, {
        name: `Implementation${suffix}${upgradeable}`,
        contractType: 'implementation',
      })
    }),
  ]

  const admins = (contract.upgradeability?.admins ?? []).map((admin, index) =>
    toAddress(admin.address, admin.isVerified, {
      name:
        (contract.upgradeability?.admins.length ?? 0) > 1
          ? `Admin (${index + 1})`
          : 'Admin',
    }),
  )

  return { addresses, admins }
}

function getExplorerAddressUrl(
  contractUrl: string | undefined,
  address: string,
): string {
  const url = new URL(
    contractUrl ?? `https://etherscan.io/address/${address}#code`,
  )
  const addressSegment = url.pathname.lastIndexOf('/address/')
  const explorerPath =
    addressSegment === -1 ? url.pathname : url.pathname.slice(0, addressSegment)

  url.pathname = `${explorerPath}/address/${address}`
  url.search = ''
  url.hash = 'code'

  return url.toString()
}

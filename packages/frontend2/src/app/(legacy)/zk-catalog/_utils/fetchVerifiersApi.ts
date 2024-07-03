import { layer2s, zkCatalogProjects } from '@l2beat/config'
import {
  type EthereumAddress,
  UnixTime,
  VerifiersApiResponse,
} from '@l2beat/shared-pure'

export async function fetchVerifiersApi(): Promise<VerifiersApiResponse> {
  // Replace with DAL :))
  const url = 'https://l2beat-production.herokuapp.com/api/verifiers'
  const res = await fetch(url)
  return VerifiersApiResponse.parse(await res.json())
}

export function getMockVerifiersApiResponse(): VerifiersApiResponse {
  const now = UnixTime.now().add(-400, 'days')
  const verifierAddress: EthereumAddress[] = []

  layer2s.forEach((l2) => {
    if (l2.stateValidation?.proofVerification) {
      const adresses = l2.stateValidation.proofVerification.verifiers.map(
        (v) => v.contractAddress,
      )
      verifierAddress.push(...adresses)
    }
  })

  zkCatalogProjects.forEach((zk) => {
    const adresses = zk.proofVerification.verifiers.map(
      (v) => v.contractAddress,
    )
    verifierAddress.push(...adresses)
  })

  const uniqueAddresses = [...new Set(verifierAddress)]

  return uniqueAddresses.map((address) => ({
    address: address.toString(),
    timestamp: now,
  }))
}

import { Contract, providers } from 'ethers'

import { GnosisSafe__factory } from '../../typechain'
import { ContractParameters, ProxyDetection } from '../../types'
import { isRevert } from '../isRevert'

async function getContract(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  const GnosisSafe = GnosisSafe__factory.connect(address, provider)

  return {
    name,
    address: GnosisSafe.address,
    upgradeability: {
      type: 'gnosis safe',
    },
    values: {
      owners: await GnosisSafe.getOwners(),
      threshold: (await GnosisSafe.getThreshold()).toNumber(),
    },
  }
}

async function detect(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const masterCopy = await getMasterCopy(provider, address)
  if (!masterCopy) {
    return
  }
  return {
    implementations: [masterCopy],
    relatives: [],
    upgradeability: {
      type: 'gnosis safe',
    },
  }
}

async function getMasterCopy(provider: providers.Provider, address: string) {
  const contract = new Contract(
    address,
    ['function masterCopy() view returns(address)'],
    provider,
  )
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return (await contract.masterCopy()) as string
  } catch (e) {
    if (isRevert(e)) {
      return undefined
    }
    throw e
  }
}

export const GnosisSafe = {
  getContract,
  getMasterCopy,
  detect,
}

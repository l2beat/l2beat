import { ethers } from 'ethers'

import { Colosseum__factory } from './typechain-gen/factories/Colosseum__factory'
import { L2OutputOracle__factory } from './typechain-gen/factories/contracts/L1/L2OutputOracle__factory'
import { ValidatorPool__factory } from './typechain-gen/factories/contracts/L1/ValidatorPool__factory'

const KromaContractAddresses = {
  mainnet: {
    validatorPool: '0xFdFF462845953D90719A78Fd12a2d103541d2103',
    l2OutputOracle: '0x180c77aE51a9c505a43A2C7D81f8CE70cacb93A6',
    colosseum: '0x713C2BEd44eB45D490afB8D4d1aA6F12290B829a',
  },
  sepolia: {
    validatorPool: '0xbc171C51D9e3E0b24AA4606824e45F93DdE6E352',
    l2OutputOracle: '0x7291913342063fd10d31651735BAF3877D2F9645',
    // colosseum: '0xA9bFbC621A65EfD1e19A28fD87f091bF72a67074', // old one, from docs
    colosseum: '0xbe15843D4335614a8fCfA7AFc83b7283cAB6E82C', // new one
  },
}

export type KromaNetwork = 'mainnet' | 'sepolia'
export type KromaContracts = ReturnType<typeof getContracts>

export function getContracts(network: KromaNetwork, wallet: ethers.Wallet) {
  const provider = wallet.provider
  const addresses = KromaContractAddresses[network]

  return {
    validatorPool: ValidatorPool__factory.connect(
      addresses.validatorPool,
      provider,
    ).connect(wallet),
    l2OutputOracle: L2OutputOracle__factory.connect(
      addresses.l2OutputOracle,
      provider,
    ).connect(wallet),
    colosseum: Colosseum__factory.connect(
      addresses.colosseum,
      provider,
    ).connect(wallet),
  }
}

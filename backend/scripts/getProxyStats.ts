import { projects } from '@l2beat/config'
import chalk from 'chalk'
import { config as dotenv } from 'dotenv'
import { constants, providers } from 'ethers'
import { compare } from './compare'
import { checkEip1967Admin, checkEip1967Implementation } from './eip1967'
import { checkNutBerryAdmin, checkNutBerryImplementation } from './nutberry'
import { checkReferenceImplementation } from './reference'
import {
  checkStarkWareCallImplementation,
  checkStarkWareConstantUpgradeDelay,
  checkStarkWareImplementation,
  checkStarkWareIsFinal,
  checkStarkWareUpgradeDelay,
} from './starkware'
import {
  checkZeppelinOsAdmin,
  checkZeppelinOsImplementation,
} from './zeppelinos'

dotenv()

main()
async function main() {
  const provider = new providers.StaticJsonRpcProvider(
    process.env.RPC_URL,
    'mainnet'
  )

  for (const project of projects) {
    console.log(chalk.blue(`--- Project: ${project.name} ---`))
    const contracts = project.details.technology?.contracts.addresses ?? []
    for (const contract of contracts) {
      console.log(chalk.yellow(contract.name), contract.address)
      const upgradeability = contract.upgradeability

      if (upgradeability?.type === 'EIP1967') {
        await checkEip1967Implementation(
          provider,
          contract.address,
          upgradeability.implementation
        )
        await checkEip1967Admin(
          provider,
          contract.address,
          upgradeability.admin
        )
      }

      if (upgradeability?.type === 'StarkWare') {
        await checkStarkWareImplementation(
          provider,
          contract.address,
          upgradeability.implementation
        )
        await checkStarkWareCallImplementation(
          provider,
          contract.address,
          upgradeability.callImplementation ?? constants.AddressZero
        )
        if (upgradeability.useConstantDelay) {
          await checkStarkWareConstantUpgradeDelay(
            provider,
            contract.address,
            upgradeability.upgradeDelay
          )
        } else {
          await checkStarkWareUpgradeDelay(
            provider,
            contract.address,
            upgradeability.upgradeDelay
          )
        }
        await checkStarkWareIsFinal(
          provider,
          contract.address,
          upgradeability.isFinal
        )
      }

      if (upgradeability?.type === 'ZeppelinOs') {
        await checkZeppelinOsImplementation(
          provider,
          contract.address,
          upgradeability.implementation
        )
        await checkZeppelinOsAdmin(
          provider,
          contract.address,
          upgradeability.admin
        )
      }

      if (upgradeability?.type === 'NutBerry') {
        await checkNutBerryImplementation(
          provider,
          contract.address,
          upgradeability.implementation
        )
        await checkNutBerryAdmin(
          provider,
          contract.address,
          upgradeability.admin
        )
      }

      if (upgradeability?.type === 'Reference') {
        const base = contracts.find((x) => x.name === upgradeability.base)
        if (base) {
          await checkReferenceImplementation(
            provider,
            base.address,
            upgradeability.method,
            upgradeability.args ?? [],
            contract.address
          )
        }
      }

      if (upgradeability === undefined) {
        await checkEip1967Implementation(
          provider,
          contract.address,
          constants.AddressZero
        )
        await checkStarkWareImplementation(
          provider,
          contract.address,
          constants.AddressZero
        )
        await checkZeppelinOsImplementation(
          provider,
          contract.address,
          constants.AddressZero
        )
        await checkNutBerryImplementation(
          provider,
          contract.address,
          constants.AddressZero
        )
      }
    }
  }
}

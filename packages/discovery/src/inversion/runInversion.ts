import { ContractValue, DiscoveryOutput, EthereumAddress } from '@l2beat/shared'
import chalk from 'chalk'
import { constants, utils } from 'ethers'
import { readFile } from 'fs/promises'

interface AddressDetails {
  name?: string
  address: string
  roles: Role[]
}

interface Role {
  name: string
  atName: string
  atAddress: EthereumAddress
}

export async function runInversion(file: string, useMermaidMarkup: boolean) {
  const addresses = new Map<string, AddressDetails>()
  const data = await readFile(file, 'utf-8')
  const project = JSON.parse(data) as DiscoveryOutput

  function add(address: ContractValue, role?: Role) {
    if (
      typeof address !== 'string' ||
      !utils.isAddress(address) ||
      address === constants.AddressZero
    ) {
      return
    }
    let details = addresses.get(address)
    if (!details) {
      details = {
        name: project.contracts.find((x) => x.address.toString() === address)
          ?.name,
        address,
        roles: [],
      }
      addresses.set(address, details)
    }
    if (role) {
      details.roles.push(role)
    }
  }

  for (const contract of project.contracts) {
    const upgradeabilityValues = {
      ...(contract.upgradeability as unknown as Record<string, ContractValue>),

      // We don't want to show the implementation as nodes in the diagram
      implementation: undefined,
      callImplementation: undefined,
      adminImplementation: undefined,
      userImplementation: undefined,
      implementations: undefined,
    }

    add(contract.address.toString())
    const values: Record<string, ContractValue | undefined> = {
      ...upgradeabilityValues,
      ...contract.values,
    }

    for (const [key, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        for (const [i, entry] of value.entries()) {
          add(entry, {
            name: `${key}.${i}`,
            atName: contract.name,
            atAddress: contract.address,
          })
        }
      } else if (value) {
        add(value, {
          name: key,
          atName: contract.name,
          atAddress: contract.address,
        })
      }
    }
  }

  if (useMermaidMarkup) {
    printMermaid(addresses)
  } else {
    print(addresses)
  }
}

function print(addresses: Map<string, AddressDetails>) {
  for (const details of addresses.values()) {
    const name = details.name
      ? chalk.blue(details.name)
      : chalk.yellow('Unknown')
    console.log(name, details.address)
    for (const role of details.roles) {
      console.log(
        '   ',
        chalk.red(role.name),
        'at',
        chalk.blue(role.atName),
        role.atAddress,
      )
    }
    console.log()
  }
}

function printMermaid(addresses: Map<string, AddressDetails>) {
  console.log('flowchart LR')
  for (const details of addresses.values()) {
    if (details.roles.length === 0) {
      console.log(
        details.address.slice(0, 6) +
          (details.name
            ? `(${details.name}\\n${details.address.slice(0, 6)})`
            : ''),
      )
    } else {
      for (const role of details.roles) {
        console.log(
          details.address.slice(0, 6) +
            (details.name
              ? `(${details.name}\\n${details.address.slice(0, 6)})`
              : ''),
          '-->|is ' + role.name + '|',
          role.atAddress.slice(0, 6) +
            (role.atName
              ? `(${role.atName}\\n${role.atAddress.slice(0, 6)})`
              : ''),
        )
      }
    }
    console.log()
  }
}

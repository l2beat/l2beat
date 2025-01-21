import { execSync } from 'child_process'
import type { ContractValue, DiscoveryOutput } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { constants, utils } from 'ethers'
import { mkdir, writeFile } from 'fs/promises'
import { isObject } from 'lodash'

import type { ConfigReader } from '../discovery/config/ConfigReader'
import type { DiscoveryConfig } from '../discovery/config/DiscoveryConfig'

export interface InvertedAddressDetails {
  name?: string
  address: string
  roles: Role[]
}

export interface Role {
  name: string
  atName: string
  atAddress: EthereumAddress
}

export type InvertedAddresses = Map<string, InvertedAddressDetails>

export async function runInversion(
  project: string,
  configReader: ConfigReader,
  useMermaidMarkup: boolean,
  chain: string,
): Promise<void> {
  const discovery = configReader.readDiscovery(project, chain)
  const config = configReader.readConfig(project, chain)
  const addresses = calculateInversion(discovery, config)

  if (useMermaidMarkup) {
    const mermaid = createMermaid(addresses)
    const mermaidPage = `
    <!DOCTYPE html>
    <html lang="en">
      <body>
        <pre class="mermaid">
          ${mermaid};
        </pre>
        <script type="module">
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        </script>
      </body>
    </html>`

    const root = `discovery/${project}/${chain}`
    await mkdir(`${root}/.mermaid`, { recursive: true })

    const htmlFilePath = `${root}/.mermaid/index.html`
    await writeFile(htmlFilePath, mermaidPage)
    await writeFile(`${root}/.mermaid/graph`, mermaid)

    execSync(`open ${htmlFilePath}`)
  } else {
    print(addresses)
  }
}

export function calculateInversion(
  discovery: DiscoveryOutput,
  config?: DiscoveryConfig,
): InvertedAddresses {
  const addresses = new Map<string, InvertedAddressDetails>()

  function add(address: ContractValue, role?: Role): void {
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
        name:
          discovery.contracts.find((x) => x.address.toString() === address)
            ?.name ??
          config?.names[address] ??
          address,
        address,
        roles: [],
      }
      addresses.set(address, details)
    }
    if (role) {
      details.roles.push(role)
    }
  }

  for (const contract of discovery.contracts) {
    add(contract.address.toString())
    const values: Record<string, ContractValue | undefined> = {
      ...contract.values,
      // We don't want to show the implementation as nodes in the diagram
      $implementation: undefined,
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
      } else if (key === 'accessControl') {
        const addRoles = (
          roleMembers: Record<string, { members: string[] }>,
        ): void => {
          for (const [roleName, role] of Object.entries(roleMembers)) {
            for (const member of role.members) {
              add(member, {
                name: roleName,
                atName: contract.name,
                atAddress: contract.address,
              })
            }
          }
        }

        const isScrollAccessControl =
          value && isObject(value) && 'roles' in value && 'targets' in value

        if (isScrollAccessControl) {
          addRoles(value.roles as Record<string, { members: string[] }>)
        } else {
          addRoles(value as Record<string, { members: string[] }>)
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

  return addresses
}

function print(addresses: Map<string, InvertedAddressDetails>): void {
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

function createMermaid(addresses: Map<string, InvertedAddressDetails>): string {
  const rows: string[] = ['flowchart LR']
  for (const details of addresses.values()) {
    if (details.roles.length === 0) {
      rows.push(
        details.address.slice(0, 6) +
          (details.name
            ? `(${details.name}\\n${details.address.slice(0, 6)})`
            : ''),
      )
    } else {
      for (const role of details.roles) {
        rows.push(
          [
            details.address.slice(0, 6) +
              (details.name
                ? `(${details.name}\\n${details.address.slice(0, 6)})`
                : ''),
            '-->|is ' + role.name + '|',
            role.atAddress.slice(0, 6) +
              (role.atName
                ? `(${role.atName}\\n${role.atAddress.slice(0, 6)})`
                : ''),
          ].join(' '),
        )
      }
    }
    rows.push('')
  }
  return rows.join('\n')
}

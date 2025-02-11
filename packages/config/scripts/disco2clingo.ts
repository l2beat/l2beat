import { EthereumAddress } from '@l2beat/shared-pure'
import { ClingoExporter } from '../src/discovery/ClingoExporter'
import { add } from 'lodash'

console.log('Hello world!')

const clingoExporter = new ClingoExporter('optimism', 'ethereum')
// const clingoExporter = new ClingoExporter('zora', 'ethereum')
// const clingoExporter = new ClingoExporter('zksync2', 'ethereum')

// const eoas = clingoExporter.getEoas();
// for (const eoa of eoas) {
//   console.log(`eoa(${eoa.address}).`);
// }

const addressToNameMap = clingoExporter.getAddressToNameMap()

const contracts = clingoExporter.getContracts()
for (const contract of contracts) {
  const template = contract.template
  if (template) {
    console.log(`% template: ${template}`)
  }
  const threshold = contract.values['$threshold']
  if (threshold !== undefined) {
    const owners = (contract.values['$members'] as EthereumAddress[]) ?? []
    console.log(`msig(${addressToNameMap[contract.address]}, ${threshold}).`)
    console.log(
      `member(${addressToNameMap[contract.address]}, (\n  ${owners.map((a) => addressToNameMap[a]).join(';\n  ')}\n))`,
    )
  } else {
    console.log(`contract(${addressToNameMap[contract.address]}).`)
  }
  const directlyReceivedPermissions = contract.directlyReceivedPermissions ?? []
  for (const permission of contract.receivedPermissions ?? []) {
    if ((permission.via ?? []).length === 0) {
      directlyReceivedPermissions.push(permission)
    }
  }
  for (const permission of directlyReceivedPermissions) {
    console.log(
      `permission(${addressToNameMap[contract.address]}, ${permission.permission}, ${addressToNameMap[permission.from]}, ${permission.delay ?? 0}, nil).`,
    )
  }

  console.log('\n')
}

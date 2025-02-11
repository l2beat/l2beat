import type { EthereumAddress } from '@l2beat/shared-pure'
import { ClingoExporter } from '../src/discovery/ClingoExporter'

const clingoExporter = new ClingoExporter('optimism', 'ethereum')
// const clingoExporter = new ClingoExporter('zora', 'ethereum')
// const clingoExporter = new ClingoExporter('zksync2', 'ethereum')

// const eoas = clingoExporter.getEoas();
// for (const eoa of eoas) {
//   console.log(`eoa(${eoa.address}).`);
// }

clingoExporter.saveClingo()

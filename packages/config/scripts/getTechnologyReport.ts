import fs from 'fs'
import path from 'path'

import { layer2s, ProjectTechnologyChoice } from '../src'

const keys = [
  'stateCorrectness',
  'dataAvailability',
  'newCryptography',
  'massExit',
  'additionalPrivacy',
  'smartContracts',
  'operator',
  'forceTransactions',
] as const

let report = ''

for (const key of keys) {
  const uppercase = key.replace(/([A-Z])/g, ' $1').toUpperCase()
  report += `------- ${uppercase} -------\n\n`

  const options = new Map<string, string[]>()
  for (const layer2 of layer2s) {
    const item = layer2.technology[key]
    if (item) {
      const signature = JSON.stringify({
        name: item.name,
        description: item.description,
        risks: item.risks,
      })
      const existing = options.get(signature)
      if (existing) {
        existing.push(layer2.display.name)
      } else {
        options.set(signature, [layer2.display.name])
      }
    }
  }

  for (const [signature, names] of options.entries()) {
    const decoded = JSON.parse(signature) as Omit<
      ProjectTechnologyChoice,
      'references'
    >
    report += `  [${names.join(', ')}]\n`
    report += `    ${decoded.name}\n\n`
    report += `    ${decoded.description}\n\n`
    if (decoded.risks.length > 0) {
      report += decoded.risks
        .map((x) => `    - ${x.category} ${x.text}`)
        .join('\n')
      report += '\n\n'
    }
  }

  fs.writeFileSync(path.join(__dirname, 'report.txt'), report)
}

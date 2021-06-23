import { projects } from '../src'
import fs from 'fs'
import path from 'path'

for (const project of projects) {
  if (project.details.features) {
    const features = project.details.features
    const risks = features.flatMap((x, i) =>
      x.risks.map((r) => ({ ...r, see: `${i + 1}) ${x.name}` }))
    )

    let content = ''
    content += `--- ${project.name} ---\n\n`
    content += 'Risks:\n-----\n\n'
    for (const risk of risks) {
      content += `- ${risk.type}. ${risk.description}\n  See: ${risk.see}\n\n`
    }

    content += 'Overview:\n---------\n\n'
    for (const [i, feature] of features.entries()) {
      content += `${i + 1}) ${feature.name}\n\n`
      content += `  ${feature.generalDescription}\n\n`
      if (feature.specificDescription) {
        content += `  ${feature.specificDescription}\n\n`
      }
      if (feature.risks.length > 0) {
        content += '  Risks:\n'
        for (const risk of feature.risks) {
          content += `    - ${risk.type}. ${risk.description}\n`
        }
        content += '\n'
      }
      if (feature.overrides) {
        content += `  This is in contrast to the default for this technology:\n`
        content += `    ${feature.overrides.name}\n`
        content += `    ${feature.overrides.generalDescription}\n`
        content += '\n'
      }
    }

    const out = path.join(__dirname, 'out')
    if (!fs.existsSync(out)) {
      fs.mkdirSync(out)
    }
    const slug = project.name.toLowerCase().replace(/[^\w]/g, '')
    fs.writeFileSync(path.join(out, `${slug}.txt`), content)
  }
}

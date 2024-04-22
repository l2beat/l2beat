import { parseCliParameters } from './cli'
import { executeCompareAll } from './executeCompareAll'
import { executeCompareProjects } from './executeCompareProjects'
import { executeFindSimilar } from './executeFindSimilar'
import { executeHelp } from './executeHelp'

void main().catch((e) => {
  console.log(e)
})

async function main() {
  const command = parseCliParameters()
  switch (command.type) {
    case 'help':
      executeHelp()
      break
    case 'similar':
      await executeFindSimilar(command)
      break
    case 'project':
      await executeCompareProjects(command)
      break
    case 'all':
      await executeCompareAll(command)
      break
  }
}

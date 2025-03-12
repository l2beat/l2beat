import { ProjectDatabase } from './ProjectDatabase'
import { getProjects } from './processing/getProjects'
import { getTokenList } from './tokens/tokens'

main()
async function main() {
  const db = new ProjectDatabase('build/db.sqlite')
  await db.init()

  const projects = getProjects()
  for (const project of projects) {
    await db.saveProject(project)
  }

  const chains = projects
    .map((p) => p.chainConfig)
    .filter((c) => c !== undefined)

  const tokenList = getTokenList(chains)
  for (const token of tokenList) {
    await db.saveToken(token)
  }
}

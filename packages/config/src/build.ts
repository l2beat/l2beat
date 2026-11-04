import { ProjectDatabase } from './ProjectDatabase'
import { getProjects } from './processing/getProjects'
import { getTokenList } from './tokens/tokens'

main()
function main() {
  const db = new ProjectDatabase('build/db.sqlite')
  db.init()

  const projects = getProjects()
  const chains = projects
    .map((p) => p.chainConfig)
    .filter((c) => c !== undefined)

  const tokenList = getTokenList(chains)
  db.transaction(() => {
    for (const project of projects) {
      db.saveProject(project)
    }

    for (const token of tokenList) {
      db.saveToken(token)
    }
  })
}

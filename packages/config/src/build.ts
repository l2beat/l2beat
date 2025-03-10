import { ProjectDatabase } from './ProjectDatabase'
import { getProjects } from './projects/project/getProjects'

main()
async function main() {
  const db = new ProjectDatabase('build/db.sqlite')
  await db.init()
  const projects = getProjects()
  for (const project of projects) {
    await db.saveProject(project)
  }
}

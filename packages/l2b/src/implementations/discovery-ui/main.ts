import { join } from 'path'
import { ConfigReader } from '@l2beat/discovery'
import express from 'express'

export function runDiscoveryUi() {
  const app = express()
  const port = 2021

  const STATIC_ROOT = join(__dirname, '../../../../protocolbeat/build')
  const DISCOVERY_ROOT = join(__dirname, '../../../../backend')
  const configReader = new ConfigReader(DISCOVERY_ROOT)

  app.get('/api/projects', (_req, res) => {
    const chains = configReader.readAllChains()
    const projectToChain = new Map<string, string[]>()
    for (const chain of chains) {
      const projects = configReader.readAllProjectsForChain(chain)
      for (const project of projects) {
        const projectChains = projectToChain.get(project) ?? []
        projectChains.push(chain)
        projectToChain.set(project, projectChains)
      }
    }
    const projects = [...projectToChain.entries()]
      .map(([name, chains]) => ({ name, chains }))
      .sort((a, b) => a.name.localeCompare(b.name))
    res.json(projects)
  })

  app.get('/api/projects/:project', (req, res) => {
    const { project } = req.params
    const chains = configReader.readAllChainsForProject(project)
    const data = chains.map((chain) => ({
      chain,
      config: configReader.readConfig(project, chain),
      discovery: configReader.readDiscovery(project, chain),
    }))
    res.json(data)
  })

  app.get('/', (_req, res) => {
    res.redirect('/ui')
  })

  app.get(['/ui', '/ui/*'], (_req, res) => {
    res.sendFile(join(STATIC_ROOT, 'index.html'))
  })

  app.use(express.static(STATIC_ROOT))

  app.listen(port, () => {
    console.log(`Discovery UI live on http://localhost:${port}/ui`)
  })
}

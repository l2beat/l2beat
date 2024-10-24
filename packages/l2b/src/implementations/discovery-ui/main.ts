import { join } from 'path'
import { ConfigReader } from '@l2beat/discovery'
import express from 'express'
import { getProject } from './getProject'
import { getProjects } from './getProjects'

export function runDiscoveryUi() {
  const app = express()
  const port = 2021

  const STATIC_ROOT = join(__dirname, '../../../../protocolbeat/build')
  const DISCOVERY_ROOT = join(__dirname, '../../../../backend')
  const configReader = new ConfigReader(DISCOVERY_ROOT)

  app.get('/api/projects', (_req, res) => {
    const response = getProjects(configReader)
    res.json(response)
  })

  app.get('/api/projects/:project', (req, res) => {
    const response = getProject(configReader, req.params.project)
    res.json(response)
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

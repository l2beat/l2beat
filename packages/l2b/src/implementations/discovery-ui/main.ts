import { join } from 'path'
import { ConfigReader } from '@l2beat/discovery'
import express from 'express'
import { executeTerminalCommand } from './executeTerminalCommand'
import { getCode } from './getCode'
import { getPreview } from './getPreview'
import { getProject } from './getProject'
import { getProjects } from './getProjects'

export function runDiscoveryUi() {
  const app = express()
  const port = 2021

  const STATIC_ROOT = join(__dirname, '../../../../protocolbeat/build')
  const DISCOVERY_ROOT = join(__dirname, '../../../../backend')
  const configReader = new ConfigReader(DISCOVERY_ROOT)

  app.use(express.json())

  app.get('/api/projects', (_req, res) => {
    const response = getProjects(configReader)
    res.json(response)
  })

  app.get('/api/projects/:project', (req, res) => {
    const response = getProject(configReader, req.params.project)
    res.json(response)
  })

  app.get('/api/projects/:project/preview', (req, res) => {
    const response = getPreview(configReader, req.params.project)
    res.json(response)
  })

  app.get('/api/projects/:project/code/:address', (req, res) => {
    const response = getCode(
      configReader,
      req.params.project,
      req.params.address,
    )
    res.json(response)
  })

  app.get('/', (_req, res) => {
    res.redirect('/ui')
  })

  app.get(['/ui', '/ui/*'], (_req, res) => {
    res.sendFile(join(STATIC_ROOT, 'index.html'))
  })

  // Start executing one of predefined commands
  // and stream the output back to the client
  app.post('/api/terminal/execute', (req, res) => {
    const { command, project, chain } = req.body
    if (!command || !project || !chain) {
      res.status(400).send('Missing required parameters')
      return
    }
    if (command !== 'discover') {
      res.status(400).send('Invalid command')
    }

    res.setHeader('Content-Type', 'text/plain')
    executeTerminalCommand(
      `(cd ../backend && pnpm discover ${chain} ${project})`,
      res,
    )
  })

  app.use(express.static(STATIC_ROOT))

  app.listen(port, () => {
    console.log(`Discovery UI live on http://localhost:${port}/ui`)
  })
}

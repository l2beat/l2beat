import path, { join } from 'path'
import {
  ConfigReader,
  TemplateService,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import express from 'express'
import { executeTerminalCommand } from './executeTerminalCommand'
import { getCode, getCodePaths } from './getCode'
import { getPreview } from './getPreview'
import { getProject } from './getProject'
import { getProjects } from './getProjects'

export function runDiscoveryUi() {
  const app = express()
  const port = 2021

  const STATIC_ROOT = join(__dirname, '../../../../protocolbeat/build')

  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const templateService = new TemplateService(paths.discovery)

  app.use(express.json())

  app.get('/api/projects', (_req, res) => {
    const response = getProjects(configReader)
    res.json(response)
  })

  app.get('/api/projects/:project', (req, res) => {
    const response = getProject(
      configReader,
      templateService,
      req.params.project,
    )
    res.json(response)
  })

  app.get('/api/projects/:project/preview', (req, res) => {
    const response = getPreview(configReader, req.params.project)
    res.json(response)
  })

  app.get('/api/projects/:project/code/:address', (req, res) => {
    const response = getCode(
      paths,
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

  app.get('/api/terminal/discover', (req, res) => {
    const { project, chain, devMode } = req.query
    if (!project || !chain || !devMode) {
      res.status(400).send('Missing required parameters')
      return
    }
    executeTerminalCommand(
      `(cd ${path.dirname(paths.discovery)} && l2b discover ${chain} ${project} ${devMode === 'true' ? '--dev' : ''})`,
      res,
    )
  })

  app.get('/api/terminal/match-flat', (req, res) => {
    const { project, address, against } = req.query
    if (!project || !address || !against) {
      res.status(400).send('Missing required parameters')
      return
    }
    const codePaths = getCodePaths(
      paths,
      configReader,
      project.toString(),
      address.toString(),
    )
    const implementationPath =
      codePaths.length > 1 ? codePaths[1].path : codePaths[0].path
    const againstPath =
      against === 'templates' ? './discovery/_templates/' : './discovery/'

    executeTerminalCommand(
      `(cd ${path.dirname(paths.discovery)} && l2b match-flat file "${implementationPath}" "${againstPath}")`,
      res,
    )
  })

  app.use(express.static(STATIC_ROOT))

  app.listen(port, () => {
    console.log(`Discovery UI live on http://localhost:${port}/ui`)
  })
}

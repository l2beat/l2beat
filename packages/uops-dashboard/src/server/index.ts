import path from 'node:path'
import express from 'express'
import { createApiRouter } from './api'
import { startServer } from './startServer'

const CLIENT_DIR = path.join(process.cwd(), 'dist/client')

const app = express()
app.use('/api', createApiRouter())
app.use(express.static(CLIENT_DIR))
// Only known client routes get the SPA shell, so unknown paths stay 404.
app.get('/stats', (_req, res) => {
  // `root` keeps send's dotfile check off the absolute path (e.g. a `.worktrees` parent dir)
  res.sendFile('index.html', { root: CLIENT_DIR })
})
startServer(app)

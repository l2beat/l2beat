import { createTokenDatabase } from '@l2beat/database'
import { config as dotenv } from 'dotenv'
import express from 'express'
import { executePlan } from '../src/execution'
import { generatePlan } from '../src/planning'

dotenv()
const db = createTokenDatabase({
  connectionString: process.env['TEST_DB_URL'],
})

const app = express()
app.use(express.json())

app.post('/generatePlan', async (req, res) => {
  const planningResult = await generatePlan(db, req.body)
  res.json(planningResult)
})

app.post('/executePlan', async (req, res) => {
  const executionResult = await executePlan(db, req.body)
  res.json(executionResult)
})

const port = Number.parseInt(process.env['PORT'] ?? '3000', 10)
const server = app.listen(port, () => {
  console.log(`Token service API listening on port ${port}`)
})

function shutdown(signal: NodeJS.Signals) {
  console.log(`Received ${signal}, shutting down...`)
  server.close(() => {
    db.close()
      .then(() => {
        process.exit(0)
      })
      .catch((error) => {
        console.error('Error while closing database connection', error)
        process.exit(1)
      })
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

import { getEnv, Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import cors from 'cors'
import { config as dotenv } from 'dotenv'
import express, { type Request, type Response } from 'express'
import { DebankClient } from './clients/DebankClient'
import { getConfig } from './config'
import { balancesRouter } from './routes/balances'
import { healthRouter } from './routes/health'
import { positionsRouter } from './routes/positions'
import { tokenRouter } from './routes/token'
import { BalanceService } from './services/BalanceService'
import { PositionService } from './services/PositionService'
import { TokenService } from './services/TokenService'
import type {
  BalanceResponse,
  PositionResponse,
  TokenInfoResponse,
} from './types/api'
import { Cache } from './utils/cache'

dotenv()

async function main() {
  const config = getConfig()
  const env = getEnv()

  const logger = new Logger({
    level: config.logLevel as
      | 'DEBUG'
      | 'INFO'
      | 'WARN'
      | 'ERROR'
      | 'CRITICAL',
  })

  logger.info('Starting DeFiScan Endpoints Service', { port: config.port })

  // Initialize HTTP client
  const httpClient = new HttpClient()

  // Initialize DeBank client
  const debankClient = new DebankClient({
    apiKey: config.debank.apiKey,
    baseUrl: config.debank.baseUrl,
    http: httpClient,
    logger: logger.for('DebankClient'),
    sourceName: 'debank',
    callsPerMinute: config.debank.callsPerMinute,
    retryStrategy: 'RELIABLE',
  })

  // Initialize caches
  const balanceCache = new Cache<BalanceResponse>(config.cache.balancesTTL)
  const positionCache = new Cache<PositionResponse>(config.cache.positionsTTL)
  const tokenCache = new Cache<TokenInfoResponse>(config.cache.balancesTTL)

  // Initialize services
  const balanceService = new BalanceService(
    debankClient,
    balanceCache,
    logger.for('BalanceService'),
  )
  const positionService = new PositionService(
    debankClient,
    positionCache,
    logger.for('PositionService'),
  )
  const tokenService = new TokenService(
    debankClient,
    tokenCache,
    logger.for('TokenService'),
  )

  // Initialize Express app
  const app = express()

  app.use(cors())
  app.use(express.json())

  // Request logging middleware
  app.use((req, res, next) => {
    logger.info('Incoming request', {
      method: req.method,
      path: req.path,
      query: req.query,
    })
    next()
  })

  // Mount routes
  app.use('/health', healthRouter)
  app.use('/balances', balancesRouter(balanceService, logger))
  app.use('/positions', positionsRouter(positionService, logger))
  app.use('/token', tokenRouter(tokenService, logger))

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: unknown) => {
    logger.error('Request error', err)
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    })
  })

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not found',
      message: `Route ${req.method} ${req.path} not found`,
    })
  })

  // Start server
  const server = app.listen(config.port, () => {
    logger.info(`DeFiScan Endpoints listening on port ${config.port}`)
  })

  // Graceful shutdown
  function shutdown(signal: NodeJS.Signals) {
    logger.info(`Received ${signal}, shutting down gracefully...`)
    server.close(() => {
      logger.info('Server closed')
      process.exit(0)
    })

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Forcing shutdown after timeout')
      process.exit(1)
    }, 10_000)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

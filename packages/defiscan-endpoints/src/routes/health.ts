import express, { type Router } from 'express'

export const healthRouter: Router = express.Router()

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  })
})

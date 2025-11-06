import { config } from '../config'
import { generateProcedure, trcpRoot } from './generateProcedure'

export const router = trcpRoot.router

export const readOnlyProcedure = generateProcedure(config, {
  acceptReadOnlyToken: true,
})

export const protectedProcedure = generateProcedure(config, {
  acceptReadOnlyToken: false,
})

import { DaLayer } from '../types/DALayer'
import { immutableXDac } from './bridges/immutablex'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const dac = {
  type: 'DAC',
  dacs: [immutableXDac],
  usedIn: [...immutableXDac.usedIn],
} satisfies DaLayer

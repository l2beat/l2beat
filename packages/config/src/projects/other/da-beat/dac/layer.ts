import { DaLayer } from '../types/DaLayer'
import { immutableXDac } from './bridges/immutablex'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const dac = {
  type: 'DAC',
  display: {
    name: 'Data Availability Committee (DAC)',
    slug: 'dac',
    description:
      'Set of parties responsible for signing and attesting to the availability of data.',
  },
  bridges: [immutableXDac],
  usedIn: [...immutableXDac.usedIn],
} satisfies DaLayer

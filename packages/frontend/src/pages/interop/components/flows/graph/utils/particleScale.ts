import {
  DOLLARS_PER_PARTICLE,
  DOLLARS_PER_PARTICLE_EXTENSION_STEP,
  DOLLARS_PER_PARTICLE_OPTIONS,
} from '../../consts'

export interface ParticleScale {
  /** Value one particle starts at, before the caps scale it up */
  base: number
  /** Allowed particle values — scaling picks the lowest one satisfying the caps */
  options: number[]
  /** Beyond the last option, values continue in multiples of this step */
  extensionStep: number
}

export const DOLLARS_PARTICLE_SCALE: ParticleScale = {
  base: DOLLARS_PER_PARTICLE,
  options: DOLLARS_PER_PARTICLE_OPTIONS,
  extensionStep: DOLLARS_PER_PARTICLE_EXTENSION_STEP,
}

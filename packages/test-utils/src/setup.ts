import { expect } from 'vitest'
import { customMatchers } from './matchers.js'

expect.extend(customMatchers)

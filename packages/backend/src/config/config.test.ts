import { Config } from './Config'

export function getTestConfig(): Config {
  return {
    name: 'Backend/Test',
    port: 3000,
  }
}

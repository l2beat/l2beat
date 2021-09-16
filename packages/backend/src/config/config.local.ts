import { Config } from './Config'

export function getLocalConfig(): Config {
  return {
    name: 'Backend/Local',
    port: 3000,
  }
}

import type { DisplayMode } from '../powerdiff'

export interface Configuration {
  path1: string
  path2: string
  displayMode: DisplayMode
  difftasticPath: string
  context: number
}

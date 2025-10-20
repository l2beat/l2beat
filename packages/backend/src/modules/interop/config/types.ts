export interface InteropConfigPlugin<T> {
  name: string
  getLatestConfig: () => Promise<T[]>
  // getPreviousConfig: () => Promise<T[]>
  // saveConfig: () => Promise<T[]>
}

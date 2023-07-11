export interface Config {
  name: string
}

export function getConfig(): Config {
  return {
    name: 'uif-example',
  }
}

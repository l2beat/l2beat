export interface Config {
  name: string
  modules: {
    main: boolean
    abc: boolean
  }
}

export function getConfig(): Config {
  return {
    name: 'uif-example',
    modules: {
      main: false,
      abc: true,
    },
  }
}

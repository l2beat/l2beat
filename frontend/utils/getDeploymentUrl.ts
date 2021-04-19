import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export function getDeploymentURL(): string {
  return publicRuntimeConfig.PUBLIC_URL
}

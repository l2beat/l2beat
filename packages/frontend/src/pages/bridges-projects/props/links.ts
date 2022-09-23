import { Bridge } from '@l2beat/config'

export function getEditLink(bridge: Bridge) {
  return `https://github.com/l2beat/l2beat/edit/master/packages/config/src/bridges/${bridge.display.slug}.ts`
}

export function getIssueLink(title: string) {
  return `https://github.com/l2beat/l2beat/issues/new?title=${title}&labels=website`
}

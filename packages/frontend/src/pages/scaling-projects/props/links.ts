import { Layer2 } from '@l2beat/config'

export function getEditLink(layer2: Layer2) {
  return `https://github.com/l2beat/l2beat/edit/master/packages/config/src/layer2s/${layer2.display.slug}.ts`
}

export function getIssueLink(title: string) {
  return `https://github.com/l2beat/l2beat/issues/new?title=${title}&labels=website`
}

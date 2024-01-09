import { Layer3 } from '@l2beat/config'

export function getEditLink(layer3: Layer3) {
  return `https://github.com/l2beat/l2beat/edit/master/packages/config/src/layer3s/${layer3.display.slug}.ts`
}

export function getIssueLink(title: string) {
  return `https://github.com/l2beat/l2beat/issues/new?title=${title}&labels=website`
}

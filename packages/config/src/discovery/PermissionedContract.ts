import { EthereumAddress } from '@l2beat/shared-pure'

import {
  StackPermissionsTag,
  StackPermissionsTagDescriptions,
} from './StackTemplateTypes'
import { stringFormat } from './values/templateUtils'

export class PermissionedContract {
  constructor(
    readonly name: string,
    readonly address: EthereumAddress,
    private readonly roleDescriptions: string[] = [],
    private readonly tags: Record<string, string[]> = {},
    private readonly referencedByTags: Record<string, string[]> = {},
  ) {}

  addTag(tag: string, name: string): void {
    this.tags[tag] ??= []
    this.tags[tag].push(name)
  }

  addTagReference(tag: string, name: string): void {
    this.referencedByTags[tag] ??= []
    this.referencedByTags[tag].push(name)
  }

  addDescription(description: string): void {
    this.roleDescriptions.push(description)
  }

  formatDescriptions(): string {
    return this.roleDescriptions.join(' ')
  }

  formatTags(): string {
    return Object.entries(this.tags)
      .map(([tag, contracts]) => {
        const description =
          StackPermissionsTagDescriptions[tag as StackPermissionsTag]
        return stringFormat(description.direct, contracts.join(', '))
      })
      .join(' ')
  }

  formatTagReferences(): string {
    return Object.entries(this.referencedByTags)
      .map(([tag, contracts]) => {
        const description =
          StackPermissionsTagDescriptions[tag as StackPermissionsTag]
        if (description.referenced) {
          return stringFormat(description.referenced, contracts.join(', '))
        }
      })
      .filter((x) => !!x)
      .join(' ')
  }

  generateDescription(): string {
    return [
      ...this.formatDescriptions(),
      ...this.formatTags(),
      ...this.formatTagReferences(),
    ].join('')
  }
}

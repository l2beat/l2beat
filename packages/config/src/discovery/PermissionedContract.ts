import type { EthereumAddress } from '@l2beat/shared-pure'

import {
  type StackPermissionsTag,
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

  getByTag(tag: StackPermissionsTag): string[] {
    return this.tags[tag] ?? []
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
    let result = [this.formatDescriptions(), this.formatTags()]
      .filter((s) => s.trim() !== '')
      .join(' ')

    const referenceDescription = this.formatTagReferences()
    if (result.trim() !== '' && referenceDescription.trim() !== '') {
      // Add reference description *only* if there already is other description.
      // We don't want description to be reference only e.g.:
      // "Owned by AdminManager" with nothing else.
      result += ' ' + referenceDescription
    }

    return result
  }
}

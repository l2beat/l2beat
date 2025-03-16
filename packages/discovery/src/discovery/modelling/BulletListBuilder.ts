interface BulletListNode {
  text: string
  children: BulletListNode[]
}

export class BulletListBuilder {
  private root: BulletListNode = { text: '', children: [] }
  private indentStack: BulletListNode[] = [this.root]

  public addItem(item: string): BulletListBuilder {
    this.currentNode().children.push({ text: item, children: [] })
    return this
  }

  public indent(): BulletListBuilder {
    const currentChildren = this.currentNode().children
    const lastChild = currentChildren[currentChildren.length - 1]
    if (!lastChild) {
      throw new Error(
        'Cannot indent when there are no items at the current level',
      )
    }
    this.indentStack.push(lastChild)
    return this
  }

  public dedent(): BulletListBuilder {
    if (this.indentStack.length <= 1) {
      throw new Error('Cannot dedent at the root level.')
    }
    this.indentStack.pop()
    return this
  }

  public resetIndent(level: number): BulletListBuilder {
    if (level < 0 || level > this.indentStack.length) {
      throw new Error(`Invalid indentation level: ${level}`)
    }
    this.indentStack = this.indentStack.slice(0, level + 1)
    return this
  }

  renderMd(options?: { mergeSingleSubpoints?: boolean }): string {
    const { mergeSingleSubpoints = false } = options ?? {}
    const lines: string[] = []

    const renderNode = (node: BulletListNode, depth: number): void => {
      for (const child of node.children) {
        let current = child
        let mergedValue = current.text
        const currentDepth = depth

        // Merge single subpoints if enabled
        while (
          mergeSingleSubpoints &&
          current.children.length === 1 &&
          current.children[0]
        ) {
          current = current.children[0]
          mergedValue += ' ' + current.text
        }

        lines.push(`${'  '.repeat(currentDepth)}* ${mergedValue}`)
        renderNode(current, currentDepth + 1)
      }
    }

    renderNode(this.root, 0)
    return lines.join('\n')
  }

  private currentNode(): BulletListNode {
    const result = this.indentStack[this.indentStack.length - 1]
    if (!result) {
      throw new Error('No current node')
    }
    return result
  }
}

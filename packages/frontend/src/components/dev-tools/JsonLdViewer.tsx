import type { JsonLdBlock } from './headTags'
import { JsonTreeNode } from './JsonTreeNode'

export function JsonLdViewer({ blocks }: { blocks: JsonLdBlock[] }) {
  if (blocks.length === 0) {
    return (
      <p className="text-2xs text-secondary">
        This page has no JSON-LD. Pages excluded from search engines emit none.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) => (
        <section key={i}>
          <h3 className="mb-1 font-semibold text-2xs text-primary uppercase tracking-[0.08em]">
            {block.isValid ? block.type : 'Invalid JSON'}
          </h3>
          {block.isValid ? (
            <JsonTreeNode value={block.data} />
          ) : (
            <pre className="whitespace-pre-wrap break-all font-mono text-2xs text-negative">
              {block.raw}
            </pre>
          )}
        </section>
      ))}
    </div>
  )
}

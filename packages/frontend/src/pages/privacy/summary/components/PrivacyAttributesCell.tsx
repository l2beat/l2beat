import type { PrivacyAttribute } from '@l2beat/config'
import { PrivacyAttributeTag } from '~/components/PrivacyAttributeTag'
import { cn } from '~/utils/cn'

export function PrivacyAttributesCell({
  attributes,
  className,
}: {
  attributes: PrivacyAttribute[]
  className?: string
}) {
  const chunks = getChunkedAttributes(attributes)

  return (
    <div className={cn('flex flex-col gap-1 py-1.5', className)}>
      {chunks.map((chunk, index) => {
        return (
          <div className="flex gap-1" key={index}>
            {chunk.map((attribute) => (
              <PrivacyAttributeTag key={attribute.id} attribute={attribute} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function getChunkedAttributes(attributes: PrivacyAttribute[]) {
  const chunkSize = Math.ceil(attributes.length / 2)
  return [attributes.slice(0, chunkSize), attributes.slice(chunkSize)] as const
}

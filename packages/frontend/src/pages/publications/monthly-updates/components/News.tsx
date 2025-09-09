import { Article } from '~/components/markdown/Article'
import type { News } from '~/content/monthly-updates'
import { cn } from '~/utils/cn'

interface Props {
  news: News[]
}

export function News({ news }: Props) {
  return (
    <div className="mt-6 md:mt-8">
      <h2 className="mb-3 text-heading-24 md:mb-6 md:text-heading-36">News</h2>
      <div className="space-y-10">
        {news.map((item) => (
          <div key={item.title}>
            <div className="flex gap-2">
              {item.tags?.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
            <div className="mt-3 mb-2 text-heading-20 leading-none md:text-heading-28">
              {item.title}
            </div>
            <Article>{item.content}</Article>
          </div>
        ))}
      </div>
    </div>
  )
}

function Tag({ tag }: { tag: string }) {
  return (
    <div
      className={cn(
        'flex h-[22px] w-fit items-center justify-center rounded px-2 font-medium text-white text-xs uppercase',
        tag === 'upcoming' &&
          'border border-positive/20 bg-positive/20 text-positive',
        tag === 'governance' && 'border border-brand/15 bg-brand/15 text-brand',
      )}
    >
      {tag}
    </div>
  )
}

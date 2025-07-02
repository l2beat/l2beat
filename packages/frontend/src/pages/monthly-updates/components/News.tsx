import { Article } from '~/components/markdown/Article'
import type { News } from '~/content/monthly-updates'
import { cn } from '~/utils/cn'

interface Props {
  news: News[]
}

export function News({ news }: Props) {
  return (
    <div className="mt-8 space-y-8">
      <h2 className="heading-36">News</h2>
      {news.map((item) => (
        <div key={item.title}>
          <h3 className="mb-4">
            <span className="heading-28 mr-3 mb-0.5 leading-normal">
              {item.title}
            </span>
            {item.tags?.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </h3>
          <Article>{item.content}</Article>
        </div>
      ))}
    </div>
  )
}

function Tag({ tag }: { tag: string }) {
  return (
    <span
      className={cn(
        '-mt-2 mr-2 inline-flex h-[26px] items-center justify-center rounded px-3 align-middle font-medium text-white text-xs uppercase',
        tag === 'upcoming' && 'border border-n-green-450 bg-n-green-700',
        tag === 'governance' && 'border border-n-blue-400 bg-n-blue-700',
      )}
    >
      {tag}
    </span>
  )
}

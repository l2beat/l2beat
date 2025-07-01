import { Article } from '~/components/markdown/Article'
import type { News } from '~/content/monthly-updates'

interface Props {
  news: News[]
}

export function News({ news }: Props) {
  return (
    <div className="space-y-8">
      <h2 className="font-bold text-[36px] leading-[115%]">News</h2>
      {news.map((news) => (
        <div key={news.title}>
          <div className="flex">
            <h3 className="heading-24 mb-4">{news.title}</h3>
          </div>
          <Article>{news.content}</Article>
        </div>
      ))}
    </div>
  )
}

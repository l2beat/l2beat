import { ReadMore } from '../../read-more'

export function AboutSection({ description }: { description: string }) {
  return (
    <div className="flex flex-1 flex-col gap-2 text-base lg:min-w-[400px]">
      <h2 className="text-xs font-medium uppercase text-secondary">About</h2>
      <p>
        <ReadMore onlyOnMobile>{description}</ReadMore>
      </p>
    </div>
  )
}

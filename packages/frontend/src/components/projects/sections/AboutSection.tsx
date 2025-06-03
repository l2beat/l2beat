import { ReadMore } from '../../ReadMore'

export function AboutSection({ description }: { description: string }) {
  return (
    <div className="flex flex-1 flex-col gap-2 text-base lg:min-w-[400px]">
      <h2 className="font-medium text-secondary text-xs uppercase">About</h2>
      <p>
        <ReadMore onlyOnMobile>{description}</ReadMore>
      </p>
    </div>
  )
}

import { ReadMore } from '../../ReadMore'

export function AboutSection({ description }: { description: string }) {
  return (
    <div className="flex flex-1 flex-col gap-2 text-base">
      <h2 className="subtitle-12 text-secondary uppercase">About</h2>
      <p className="paragraph-13">
        <ReadMore onlyOnMobile>{description}</ReadMore>
      </p>
    </div>
  )
}

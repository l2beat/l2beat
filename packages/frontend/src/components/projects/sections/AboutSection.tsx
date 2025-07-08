import { ReadMore } from '../../ReadMore'

export function AboutSection({ description }: { description: string }) {
  return (
    <div className="flex flex-1 flex-col gap-2 text-base">
      <h2 className="text-secondary text-subtitle-12 uppercase">About</h2>
      <p className="text-paragraph-13">
        <ReadMore onlyOnMobile>{description}</ReadMore>
      </p>
    </div>
  )
}

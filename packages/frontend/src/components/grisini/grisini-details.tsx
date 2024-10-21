import {
  SingleGrisiniDetails,
  SingleGrisiniDetailsProps,
} from './single-grisini-details'

export function GrisiniDetails({
  items,
}: { items: SingleGrisiniDetailsProps[] }) {
  return (
    <div className="flex flex-col gap-3 w-[264px]">
      {items.map((item) => (
        <SingleGrisiniDetails {...item} />
      ))}
    </div>
  )
}

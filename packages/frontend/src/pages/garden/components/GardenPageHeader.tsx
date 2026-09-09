import { MainPageHeader } from '~/components/MainPageHeader'

// `MainPageHeader` hides below `lg`, so the title is repeated in a plain heading there.
export function GardenPageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <>
      <h1 className="pt-5 font-bold text-2xl max-md:px-4 lg:hidden">{title}</h1>
      <MainPageHeader description={description}>{title}</MainPageHeader>
    </>
  )
}

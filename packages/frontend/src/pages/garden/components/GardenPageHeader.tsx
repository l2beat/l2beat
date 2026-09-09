import { MainPageHeader } from '~/components/MainPageHeader'

/**
 * The page title, on every viewport. `MainPageHeader` hides itself below
 * `lg`, where most pages carry their own header; the garden pages have none,
 * so they repeat the title in a plain heading there.
 */
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

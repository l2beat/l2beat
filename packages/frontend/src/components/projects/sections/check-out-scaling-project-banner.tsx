import { type UsedInProject } from '@l2beat/config/build/src/projects/other/da-beat/types/UsedInProject'
import Image from 'next/image'
import { CustomLink } from '~/components/link/custom-link'

export function CheckOutScalingProjectBanner({
  dacUsedIn,
  what,
}: {
  dacUsedIn: UsedInProject
  what: 'permissions' | 'contracts'
}) {
  return (
    <div className="mb-2 mt-6 flex flex-row items-center gap-2 rounded-md bg-gray-200 px-4 py-2.5 text-xs font-medium dark:bg-zinc-800">
      Check all {what} for the scaling project here:
      <CustomLink
        href={`/scaling/projects/${dacUsedIn.slug}`}
        className="flex flex-row items-center gap-1"
      >
        <Image
          className="size-5"
          src={`/icons/${dacUsedIn.slug}.png`}
          alt={dacUsedIn.name}
          width={20}
          height={20}
        />
        {dacUsedIn.name}
      </CustomLink>
    </div>
  )
}

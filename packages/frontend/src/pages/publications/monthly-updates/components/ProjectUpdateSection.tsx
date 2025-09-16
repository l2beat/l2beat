import type { ProjectCustomColors } from '@l2beat/config'
import { CssVariables } from '~/components/CssVariables'

interface Props {
  id: string
  children: React.ReactNode
  bannerImg?: string
  colors?: ProjectCustomColors
}

export function ProjectUpdateSection({
  children,
  id,
  bannerImg,
  colors,
}: Props) {
  return (
    <div id={id} className="mb-8 scroll-mt-8 md:mb-16">
      {colors && (
        <CssVariables
          variables={{
            [`${id}-primary`]: colors.primary,
            [`${id}-secondary`]: colors.secondary,
          }}
        />
      )}
      <img
        src={bannerImg}
        className="mb-4 min-h-[70px] w-full rounded-lg object-cover md:mb-8"
      />
      {children}
    </div>
  )
}

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
    <section
      id={id}
      data-role="nav-section"
      className="mb-8 scroll-mt-[56px] md:mb-16 md:scroll-mt-8"
    >
      <img
        src={bannerImg}
        className="mb-4 min-h-[70px] w-full rounded-lg object-cover md:mb-8"
      />
      {colors ? (
        <CssVariables
          variables={{
            'project-primary': colors.primary,
            'project-secondary': colors.secondary,
          }}
        >
          {children}
        </CssVariables>
      ) : (
        children
      )}
    </section>
  )
}

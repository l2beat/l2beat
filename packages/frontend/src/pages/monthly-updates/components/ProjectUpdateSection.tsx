import type { ProjectColors } from '@l2beat/config'

interface Props {
  name: string
  children: React.ReactNode
  bannerImg?: string
  colors?: ProjectColors
}

export function ProjectUpdateSection({
  children,
  name,
  bannerImg,
  colors,
}: Props) {
  return (
    <div
      id={name}
      className="mb-8 md:mb-16"
      style={
        colors
          ? ({
              '--project-primary': colors.primary,
              '--project-secondary': colors.secondary,
            } as React.CSSProperties)
          : undefined
      }
    >
      <img
        src={bannerImg}
        className="mb-4 min-h-[70px] w-full rounded-lg object-cover md:mb-8"
      />
      {children}
    </div>
  )
}

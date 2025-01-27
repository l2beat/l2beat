import type { SVGAttributes } from 'react'

export type SvgIconProps = SVGAttributes<SVGElement>

export function SvgIcon({
  className,
  width,
  height,
  viewBox,
  ...rest
}: SvgIconProps & {
  width: string | number
  height: string | number
  viewBox: string
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      fill="currentColor"
      role="img"
      {...rest}
    />
  )
}

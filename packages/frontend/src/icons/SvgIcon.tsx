import type { SVGAttributes } from 'react'

export type SvgIconProps = SVGAttributes<SVGElement>

/**
 * Unlabelled icons are decorative: the control or text around them carries
 * the name, which a shape label like "Chevron icon" would only pollute.
 */
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
  const isLabelled =
    rest['aria-label'] !== undefined || rest['aria-labelledby'] !== undefined
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={className}
      fill="currentColor"
      role={isLabelled ? 'img' : undefined}
      aria-hidden={isLabelled ? undefined : true}
      {...rest}
    />
  )
}

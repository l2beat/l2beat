import { type CustomLinkProps, linkVariants } from './link/custom-link'

export function OutLink({
  variant,
  underline,
  className,
  ...props
}: CustomLinkProps) {
  return (
    <a
      target="_blank"
      rel="noreferrer noopener"
      className={linkVariants({ variant, underline, className })}
      {...props}
    />
  )
}

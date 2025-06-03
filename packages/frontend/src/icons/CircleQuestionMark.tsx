import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

type CircleQuestionMarkIconProps = SvgIconProps & {
  questionMarkClassName?: string
}

export function CircleQuestionMarkIcon({
  questionMarkClassName,
  ...props
}: CircleQuestionMarkIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-label="Circle with a question mark inside"
      fill="#4D6785"
      {...props}
    >
      <circle cx="10.0002" cy="10" r="8.3" />
      <path
        d="M10.0287 5.24994C8.09194 5.24994 6.99365 6.33503 6.9624 7.90573V7.98431H8.67215V7.90573C8.70965 7.21198 9.18959 6.76437 9.91498 6.76437C10.6341 6.76437 11.1136 7.18016 11.1136 7.76688C11.1136 8.35359 10.8675 8.65652 10.0538 9.14246C9.18313 9.65339 8.83578 10.2212 8.91782 11.2306L8.92773 11.4999H10.6024V11.2436C10.6024 10.6381 10.836 10.3284 11.6751 9.84283C12.5645 9.31901 13.0247 8.6569 13.0247 7.71042C13.0247 6.253 11.833 5.24994 10.0287 5.24994ZM9.8013 12.6718C9.1595 12.6718 8.75912 13.0444 8.75912 13.6514C8.75912 14.253 9.15989 14.6249 9.8013 14.6249C10.4427 14.6249 10.8381 14.253 10.8381 13.6514C10.8381 13.0444 10.4431 12.6718 9.8013 12.6718Z"
        fill="#FAFAFA"
        className={questionMarkClassName}
      />
    </SvgIcon>
  )
}

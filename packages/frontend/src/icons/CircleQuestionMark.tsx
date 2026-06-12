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
        d="M10.029 5.25c-1.937 0-3.035 1.085-3.067 2.656v.078h1.71v-.078c.038-.694.518-1.142 1.243-1.142.72 0 1.199.416 1.199 1.003s-.247.89-1.06 1.375c-.87.511-1.218 1.08-1.136 2.089l.01.269h1.674v-.256c0-.606.234-.916 1.073-1.401.89-.524 1.35-1.186 1.35-2.133 0-1.457-1.192-2.46-2.996-2.46M9.8 12.672c-.642 0-1.042.372-1.042.98 0 .601.4.973 1.042.973s1.037-.372 1.037-.974c0-.607-.395-.98-1.037-.98"
        fill="#FAFAFA"
        className={questionMarkClassName}
      />
    </SvgIcon>
  )
}

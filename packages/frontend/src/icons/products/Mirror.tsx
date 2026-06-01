import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function MirrorIcon({ className, ...props }: SvgIconProps) {
  return (
    <>
      <LightMirrorIcon {...props} className={cn(className, 'dark:hidden')} />
      <DarkMirrorIcon
        {...props}
        className={cn(className, 'hidden dark:block')}
      />
    </>
  )
}

function DarkMirrorIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <g clipPath="url(#clip0_1650_1764)">
        <g clipPath="url(#clip1_1650_1764)">
          <path
            d="M2.162 6.306a5.806 5.806 0 0111.613 0v8.312a.88.88 0 01-.882.882H3.044a.88.88 0 01-.882-.882z"
            fill="url(#paint0_linear_1650_1764)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.085 14.78V6.322c0-2.834-2.29-5.131-5.116-5.131S2.852 3.489 2.852 6.323v8.456c0 .016.013.03.029.03h10.175a.03.03 0 00.03-.03M7.97.5C4.762.5 2.162 3.107 2.162 6.323v8.456c0 .398.322.721.719.721h10.175a.72.72 0 00.719-.72V6.322c0-3.216-2.6-5.823-5.806-5.823"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1650_1764"
          x1="3.65684"
          y1="1.36486"
          x2="13.8173"
          y2="17.4822"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.265625" stopColor="white" stopOpacity="0" />
          <stop offset="0.734375" stopColor="white" />
        </linearGradient>
        <clipPath id="clip0_1650_1764">
          <rect width="16" height="16" fill="white" />
        </clipPath>
        <clipPath id="clip1_1650_1764">
          <rect
            width="11.6757"
            height="15"
            fill="white"
            transform="translate(2.16211 0.5)"
          />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}

function LightMirrorIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <g clipPath="url(#clip0_1650_3299)">
        <g clipPath="url(#clip1_1650_3299)">
          <path
            d="M2.162 6.306a5.806 5.806 0 0111.613 0v8.312a.88.88 0 01-.882.882H3.044a.88.88 0 01-.882-.882z"
            fill="url(#paint0_linear_1650_3299)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.085 14.78V6.322c0-2.834-2.29-5.131-5.116-5.131S2.852 3.489 2.852 6.323v8.456c0 .016.013.03.029.03h10.175a.03.03 0 00.03-.03M7.97.5C4.762.5 2.162 3.107 2.162 6.323v8.456c0 .398.322.721.719.721h10.175a.72.72 0 00.719-.72V6.322c0-3.216-2.6-5.823-5.806-5.823"
            fill="#1B1B1B"
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1650_3299"
          x1="3.65684"
          y1="1.36486"
          x2="13.8173"
          y2="17.4822"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.265625" stopColor="#1B1B1B" stopOpacity="0" />
          <stop offset="0.734375" stopColor="#1B1B1B" />
        </linearGradient>
        <clipPath id="clip0_1650_3299">
          <rect width="16" height="16" fill="white" />
        </clipPath>
        <clipPath id="clip1_1650_3299">
          <rect
            width="11.6757"
            height="15"
            fill="white"
            transform="translate(2.16211 0.5)"
          />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}

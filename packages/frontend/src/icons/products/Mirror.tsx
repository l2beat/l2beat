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
            d="M2.16211 6.30645C2.16211 3.09964 4.76175 0.5 7.96856 0.5C11.1754 0.5 13.775 3.09964 13.775 6.30645V14.6177C13.775 15.105 13.38 15.5 12.8926 15.5H3.04447C2.55715 15.5 2.16211 15.105 2.16211 14.6177V6.30645Z"
            fill="url(#paint0_linear_1650_1764)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.0851 14.7793V6.32337C13.0851 3.48933 10.7944 1.19189 7.96856 1.19189C5.14276 1.19189 2.85198 3.48933 2.85198 6.32337V14.7793C2.85198 14.7952 2.86485 14.8081 2.88073 14.8081H13.0564C13.0723 14.8081 13.0851 14.7952 13.0851 14.7793ZM7.96856 0.5C4.76175 0.5 2.16211 3.10721 2.16211 6.32337V14.7793C2.16211 15.1773 2.48385 15.5 2.88073 15.5H13.0564C13.4533 15.5 13.775 15.1773 13.775 14.7793V6.32337C13.775 3.10721 11.1754 0.5 7.96856 0.5Z"
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
            d="M2.16211 6.30645C2.16211 3.09964 4.76175 0.5 7.96856 0.5C11.1754 0.5 13.775 3.09964 13.775 6.30645V14.6177C13.775 15.105 13.38 15.5 12.8926 15.5H3.04447C2.55715 15.5 2.16211 15.105 2.16211 14.6177V6.30645Z"
            fill="url(#paint0_linear_1650_3299)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.0851 14.7793V6.32337C13.0851 3.48933 10.7944 1.19189 7.96856 1.19189C5.14276 1.19189 2.85198 3.48933 2.85198 6.32337V14.7793C2.85198 14.7952 2.86485 14.8081 2.88073 14.8081H13.0564C13.0723 14.8081 13.0851 14.7952 13.0851 14.7793ZM7.96856 0.5C4.76175 0.5 2.16211 3.10721 2.16211 6.32337V14.7793C2.16211 15.1773 2.48385 15.5 2.88073 15.5H13.0564C13.4533 15.5 13.775 15.1773 13.775 14.7793V6.32337C13.775 3.10721 11.1754 0.5 7.96856 0.5Z"
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

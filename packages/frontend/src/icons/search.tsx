import { SvgIcon, type SvgIconProps } from './svg-icon'

export function SearchIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-label="Search icon"
      stroke="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.60004 7.99984C1.60004 4.23984 4.64004 1.19984 8.40004 1.19984C12.16 1.19984 15.2 4.23984 15.2 7.99984C15.2 9.54868 14.6842 10.9753 13.8147 12.1177L18.6485 16.9515L16.9515 18.6486L12.046 13.7431C10.9928 14.4124 9.74231 14.7998 8.40004 14.7998C4.64004 14.7998 1.60004 11.7598 1.60004 7.99984ZM3.20004 7.99984C3.20004 10.8798 5.52004 13.1998 8.40004 13.1998C11.28 13.1998 13.6 10.8798 13.6 7.99984C13.6 5.11984 11.28 2.79984 8.40004 2.79984C5.52004 2.79984 3.20004 5.11984 3.20004 7.99984Z"
      />
    </SvgIcon>
  )
}

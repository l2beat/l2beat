import { SvgIcon, type SvgIconProps } from './SvgIcon'

export function ImageIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M17.75 20.25H6.25a2.5 2.5 0 01-2.5-2.5V6.25a2.5 2.5 0 012.5-2.5h11.5a2.5 2.5 0 012.5 2.5v11.5a2.5 2.5 0 01-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
      <path
        d="M3.75 16.25l4.47-4.47a1.5 1.5 0 012.12 0l5.91 5.91"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 15l1.72-1.72a1.5 1.5 0 012.12 0l2.91 2.91"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 10.5a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5"
        fill="currentColor"
      />
    </SvgIcon>
  )
}

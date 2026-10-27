import { Icon } from './Icon'

export function IconWebApp(props: { className?: string }) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13.3333 2.66667H2.66667C1.93029 2.66667 1.33333 3.26362 1.33333 4V12C1.33333 12.7364 1.93029 13.3333 2.66667 13.3333H13.3333C14.0697 13.3333 14.6667 12.7364 14.6667 12V4C14.6667 3.26362 14.0697 2.66667 13.3333 2.66667Z" />
      <path d="M6.66667 2.66667V5.33333" />
      <path d="M1.33333 5.33333H14.6667" />
      <path d="M4 2.66667V5.33333" />
    </Icon>
  )
}

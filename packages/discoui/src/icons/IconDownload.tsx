import { Icon } from './Icon'

export function IconDownload(props: { className?: string }) {
  return (
    <Icon
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      {...props}
    >
      <path d="M8 10V2" />
      <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" />
      <path d="M4.66667 6.66667L8 10L11.3333 6.66667" />
    </Icon>
  )
}

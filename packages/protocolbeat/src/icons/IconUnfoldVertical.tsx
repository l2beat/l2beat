import { Icon } from './Icon'

export function IconUnfoldVertical(props: { className?: string }) {
  return (
    <Icon fill="currentColor" stroke="currentColor" {...props}>
      <path d="M8 14.6667V10.6667" />
      <path d="M8 5.33333V1.33333" />
      <path d="M2.66667 8H1.33333" />
      <path d="M6.66667 8H5.33333" />
      <path d="M10.6667 8H9.33333" />
      <path d="M14.6667 8H13.3333" />
      <path d="M10 12.6667L8 14.6667L6 12.6667" />
      <path d="M10 3.33333L8 1.33333L6 3.33333" />
    </Icon>
  )
}

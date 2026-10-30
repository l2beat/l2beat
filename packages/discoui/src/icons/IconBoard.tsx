import { Icon } from './Icon'

export function IconBoard(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M1 2H15V14H1V2ZM3 4V6H7V4H3ZM9 4V6H13V4H9ZM3 8V12H7V8H3ZM9 8V12H13V8H9Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Icon>
  )
}

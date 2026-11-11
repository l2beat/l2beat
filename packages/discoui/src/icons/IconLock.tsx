import { Icon } from './Icon'

export function IconLock(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 7V5a3 3 0 1 1 6 0v2h1.5l.5.5v7l-.5.5h-9l-.5-.5v-7l.5-.5H5Zm1 0h4V5a2 2 0 1 0-4 0v2ZM4 8v6h8V8H4Z"
        fill="currentColor"
      />
    </Icon>
  )
}

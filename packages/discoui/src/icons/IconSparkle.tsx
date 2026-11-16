import { Icon } from './Icon'

export function IconSparkle(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M7 1H9V5H11V7H15V9H11V11H9V15H7V11H5V9H1V7H5V5H7V1Z"
        fill="currentColor"
      />
    </Icon>
  )
}

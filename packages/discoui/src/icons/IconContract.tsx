import { Icon } from './Icon'

export function IconContract(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.71 4.29L10.71 1.29L10 1H4L3 2V14L4 15H13L14 14V5L13.71 4.29ZM13 14H4V2H9V6H13V14ZM10 5V2L13 5H10Z"
        fill="currentColor"
      />
    </Icon>
  )
}

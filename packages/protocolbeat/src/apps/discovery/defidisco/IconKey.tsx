import { Icon } from '../../../icons/Icon'

export function IconKey(props: { className?: string }) {
  return (
    <Icon {...props}>
      {/* Key: circle head + shaft with teeth */}
      <circle
        cx="5"
        cy="5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M7 7L12 12M10 12H12V10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  )
}

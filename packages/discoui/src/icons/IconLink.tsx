import { Icon } from './Icon'

export function IconLink(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M2.5 1.99994L6 1.99988V2.99988L3 2.99994V12.9999H13V9.99994H14V13.4999L13.5 13.9999H2.5L2 13.4999V2.49994L2.5 1.99994Z"
        fill="currentColor"
      />
      <path
        d="M14 2.49994L14.0001 7.99991H13.0001L13 3.70704L8.24269 8.46438L7.53558 7.75728L12.2929 2.99993L8.00003 2.99994V1.99994H13.5L14 2.49994Z"
        fill="currentColor"
      />
    </Icon>
  )
}

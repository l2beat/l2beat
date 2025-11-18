import { Icon } from './Icon'

export function IconUntemplatized(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M2.75 4.7168V13.25H6.875V8.8418L7.625 9.5918V13.5C7.625 13.776 7.401 14 7.125 14H2.5C2.224 14 2 13.776 2 13.5V3.9668L2.75 4.7168ZM9.125 11.0918V13.25H11.2832L12.0332 14H8.875C8.599 14 8.375 13.776 8.375 13.5V10.3418L9.125 11.0918ZM13.5 8.375C13.776 8.375 14 8.599 14 8.875V12.0332L13.25 11.2832V9.125H11.0918L10.3418 8.375H13.5ZM13.5 2C13.776 2 14 2.224 14 2.5V7.125C14 7.401 13.776 7.625 13.5 7.625H9.5918L8.375 6.4082V2.5C8.375 2.224 8.599 2 8.875 2H13.5ZM9.125 6.875H13.25V2.75H9.125V6.875ZM7.125 2C7.401 2 7.625 2.224 7.625 2.5V5.6582L6.875 4.9082V2.75H4.7168L3.9668 2H7.125Z"
        fill="currentColor"
      />
      <path
        d="M1.5 1.5L14.5 14.5"
        stroke="currentColor"
        stroke-width="1.05"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Icon>
  )
}

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'

interface ExpandableProps {
  trigger: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export function Expandable({ trigger, children, defaultOpen = false }: ExpandableProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      <DisclosureButton className="flex w-full items-center gap-2 text-left group">
        <svg
          className="h-4 w-4 text-text-muted transition-transform ui-open:rotate-90 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {trigger}
      </DisclosureButton>
      <DisclosurePanel className="pl-6 mt-1">{children}</DisclosurePanel>
    </Disclosure>
  )
}

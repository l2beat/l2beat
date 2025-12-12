import { Toaster } from 'sonner'
import { IconChecked } from '../../../icons/IconChcked'
import { IconInfoCircle } from '../../../icons/IconInfoCircle'
import { IconTriangleAlert } from '../../../icons/IconTriangleAlert'

export function NotificationsRoot() {
  return (
    <Toaster
      className="toaster group"
      duration={4_000}
      icons={{
        success: <IconChecked className="text-aux-green" />,
        error: <IconTriangleAlert className="text-aux-red" />,
        warning: <IconTriangleAlert className="text-aux-yellow" />,
        info: <IconInfoCircle className="text-aux-blue" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'group flex w-full items-center gap-3 rounded-none border border-coffee-400 bg-coffee-700 p-4 text-coffee-200 shadow-lg',
          title: 'text-sm font-medium',
          description: 'text-xs text-coffee-400',
          icon: 'flex items-center justify-center',
          actionButton:
            'border border-coffee-400 bg-coffee-400/50 px-3 py-1 text-sm font-medium text-coffee-200 transition-colors hover:bg-coffee-400/70',
          cancelButton:
            'border border-coffee-400 px-3 py-1 text-sm font-medium text-coffee-200 transition-colors hover:bg-coffee-400/50',
          closeButton:
            'border border-coffee-400 bg-coffee-700 text-coffee-200 hover:bg-coffee-600',
          error: '!border-aux-red',
          success: '!border-aux-green',
          warning: '!border-aux-yellow',
          info: '!border-aux-blue',
        },
      }}
    />
  )
}

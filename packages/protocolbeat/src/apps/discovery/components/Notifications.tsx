import { Toaster } from 'sonner'
import { IconChecked } from '../../../icons/IconChcked'
import { IconGears } from '../../../icons/IconGear'
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
        warning: <IconTriangleAlert className="shad text-aux-yellow" />,
        info: <IconInfoCircle className="text-aux-blue" />,
        loading: <IconGears animate className="text-aux-teal" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-full items-center gap-3 rounded-none border border-coffee-400 bg-coffee-700 px-3 py-2 text-coffee-200 shadow-lg shadow-coffee-900',
          title: 'text-sm font-medium',
          description: 'text-xs text-coffee-400',
          error: '!border-aux-red',
          success: '!border-aux-green',
          warning: '!border-aux-yellow',
          info: '!border-aux-blue',
          loading: '!border-aux-teal',

          loader: '!relative !top-[8px]', // loaders is wicked

          actionButton: '',
          cancelButton: '',
          closeButton: '',
        },
      }}
    />
  )
}

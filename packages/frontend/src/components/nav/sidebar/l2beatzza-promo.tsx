import Image from 'next/image'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '~/components/core/dialog'
import { StepController } from '~/components/pizza-flow'

export function L2BeatzzaPromo() {
  return (
    <Dialog>
      <div className="relative h-[160px] w-[200px] rounded-lg border border-divider max-lg:hidden">
        <Image
          src={'/images/l2beatzza/sidebar-desktop.png'}
          alt={'L2BEATZZA image'}
          width={600}
          height={480}
          className="rounded-lg"
          priority
        />
        <DialogTrigger className="absolute inset-x-3 bottom-3 h-8 rounded bg-primary-invert text-xs font-bold text-primary">
          Make Your Pizza
        </DialogTrigger>
      </div>
      <DialogTrigger asChild>
        <div className="w-full rounded-lg border border-divider lg:hidden">
          <Image
            src={'/images/l2beatzza/sidebar-mobile.png'}
            alt={'L2BEATZZA image'}
            width={1260}
            height={330}
            className="rounded-t-lg"
            priority
          />
          <div className="flex h-8 w-full items-center justify-center rounded rounded-b-lg bg-primary-invert text-xs font-bold text-primary">
            Make Your Pizza
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="flex items-center justify-center bg-surface-primary pt-16 md:left-1/2 md:top-1/2 md:h-[560px] md:max-w-[800px] md:-translate-x-1/2 md:-translate-y-1/2"
        fullScreenMobile
      >
        <DialogTitle className="hidden">Pizza time</DialogTitle>
        <StepController />
        <DialogClose className="absolute right-5 top-5 flex size-[20px] items-center justify-center rounded-sm dark:bg-pink-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-primary-invert"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

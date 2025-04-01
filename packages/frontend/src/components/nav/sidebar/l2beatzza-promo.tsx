import Image from 'next/image'
import { useL2BeatzzaDialog } from '~/components/l2beatzza/l2beatzza-dialog'

export function L2BeatzzaPromo() {
  const { setOpen } = useL2BeatzzaDialog()

  return (
    <>
      <button
        className="relative h-[160px] w-[200px] rounded-lg border border-divider max-lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Image
          src={'/images/l2beatzza/sidebar-desktop.png'}
          alt={'L2BEATZZA image'}
          width={600}
          height={480}
          className="rounded-lg"
          priority
        />
        <div className="absolute inset-x-3 bottom-3 flex h-8 items-center justify-center rounded bg-primary-invert text-xs font-bold text-primary">
          Make Your Pizza
        </div>
      </button>
      <button
        className="w-full rounded-lg border border-divider lg:hidden"
        onClick={() => setOpen(true)}
      >
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
      </button>
    </>
  )
}

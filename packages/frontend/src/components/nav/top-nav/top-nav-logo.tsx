'use client'
import Link from 'next/link'
import { useL2BeatzzaDialog } from '~/components/l2beatzza/l2beatzza-dialog'
import { Logo } from '~/components/logo'
import { env } from '~/env'
import { L2BeatzzaLogo } from '~/icons/l2beatzza-logo'

export function TopNavLogo({ logoLink }: { logoLink: string }) {
  const { setOpen } = useL2BeatzzaDialog()

  return env.NEXT_PUBLIC_L2BEATZZA ? (
    <button onClick={() => setOpen(true)}>
      <L2BeatzzaLogo className="w-20" />
    </button>
  ) : (
    <Link href={logoLink}>
      <Logo className="h-8 w-auto" />
    </Link>
  )
}

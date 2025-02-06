import { InfoIcon } from '~/icons/info'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from './core/drawer'

export function RollupsInfo() {
  return (
    <InfoWithMobileDrawer
      title="What are rollups?"
      content="Rollups are L2s that periodically post state commitments to Ethereum.
        These commitments are validated by either Validity Proofs or are
        accepted optimistically and can be challenged via Fraud Proof mechanism
        within a certain fraud proof window. Additionally L2 data is also posted
        to Ethereum, hence there are no additional trust assumptions introduced."
    />
  )
}

export function ValidiumsAndOptimiumsInfo() {
  return (
    <InfoWithMobileDrawer
      title="What are Validiums and Optimiums?"
      content="Validiums and Optimiums are L2s that, similarly to Rollups,
      periodically post state commitments to Ethereum that are validated by it,
      however data is not posted to Ethereum. This means that additional trust
      assumptions, external to Ethereum, are introduced to prevent data
      withholding attacks."
    />
  )
}

export function OthersInfo() {
  return (
    <InfoWithMobileDrawer
      title="What are Others?"
      content="Others are L2s that either lack a working proof system or
      don&apos;t provide sufficient external DA guarantees (i.e. at least 5
      independent attesters, a high enough threshold, or a proper DA bridge). To be listed in this category, the L2 must enshrine deposits from L1."
    />
  )
}

function InfoWithMobileDrawer({
  title,
  content,
}: { title: string; content: string }) {
  return (
    <div className="flex flex-row sm:mb-2">
      <div className="text-[11px] leading-snug text-zinc-500 dark:text-secondary md:text-[13px] md:leading-tight">
        <p className="max-sm:hidden">{content}</p>
        <Drawer>
          <DrawerTrigger className="flex items-center gap-1 sm:hidden">
            <InfoIcon className="size-3 fill-blue-550" />
            <div className="text-2xs font-medium underline">{title}</div>
          </DrawerTrigger>
          <DrawerContent className="px-1 pb-0">
            <DrawerHeader className="text-[18px] font-semibold text-zinc-800 dark:text-primary">
              {title}
            </DrawerHeader>
            <p className="mt-4 text-sm font-normal text-zinc-500 dark:text-primary">
              {content}
            </p>
            <DrawerTrigger className="w-full py-8 text-center text-zinc-500 underline dark:text-primary">
              Close
            </DrawerTrigger>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}

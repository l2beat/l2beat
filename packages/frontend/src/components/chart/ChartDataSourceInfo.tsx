import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { CustomLink } from '~/components/link/CustomLink'
import { InfoIcon } from '~/icons/Info'

interface Props {
  dataSource: string
  href?: string
  scope?: string
}

export function ChartDataSourceInfo({ dataSource, href, scope }: Props) {
  const source = href ? (
    <CustomLink href={href}>{dataSource}</CustomLink>
  ) : (
    dataSource
  )
  return (
    <>
      <div className="font-medium text-2xs text-secondary [overflow-wrap:anywhere] max-sm:hidden">
        Data source: {source}
        {scope ? ` · ${scope}` : null}
      </div>
      <Drawer>
        <DrawerTrigger className="flex items-center gap-1 font-medium text-[13px] text-secondary sm:hidden">
          Data source
          <InfoIcon className="size-4" />
        </DrawerTrigger>
        <DrawerContent className="px-1 pb-8">
          <DrawerHeader>
            <DrawerTitle className="font-semibold text-[18px] text-primary">
              Data source
            </DrawerTitle>
            <DrawerDescription className="font-normal text-primary [overflow-wrap:anywhere]">
              {source}
              {scope ? ` · ${scope}` : null}
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  )
}

import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { InteropTokenFramework } from './getInteropTokenFrameworksData'

interface Props extends AppLayoutProps {
  tokenFrameworks: InteropTokenFramework[]
}

export function InteropTokenFrameworksPage({
  tokenFrameworks,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Comparing five major multichain token frameworks covered in LI.FI's analysis. Data is sourced from L2BEAT's interop tracking infrastructure. Claims from the original article">
          Token frameworks
        </MainPageHeader>
        <div className="mt-4 flex flex-wrap gap-2">
          {tokenFrameworks.map((framework) => (
            <div
              key={framework.id}
              className="flex items-center gap-2 rounded-lg bg-surface-secondary px-3 py-2 font-medium text-sm"
            >
              <img
                src={framework.iconUrl}
                alt={framework.name}
                className="size-5 rounded-full"
              />
              <span>{framework.label}</span>
              <span className="text-secondary">{framework.name}</span>
            </div>
          ))}
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}

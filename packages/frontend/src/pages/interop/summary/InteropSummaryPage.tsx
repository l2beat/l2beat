import type { InteropChain } from '@l2beat/config'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ChainSelector } from './components/ChainSelector'
import { InteropSelectedChainsProvider } from './utils/InteropSelectedChainsContext'

interface Props extends AppLayoutProps {
  interopChains: InteropChain[]
}

export function InteropSummaryPage({ ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout fullWidth>
        <MainPageHeader>Ethereum Ecosystem Interop</MainPageHeader>
        <InteropSelectedChainsProvider interopChains={props.interopChains}>
          <ChainSelector chains={props.interopChains} />
        </InteropSelectedChainsProvider>
      </SideNavLayout>
    </AppLayout>
  )
}

import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { MultiChainSelector } from '../components/chain-selector/MultiChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InteropSelectedChainsProvider } from '../utils/InteropSelectedChainsContext'
import type { InteropSelection } from '../utils/types'
import { HistoryIntro, HistoryMethodology } from './components/HistoryExplainer'
import { InteropHistoryView } from './components/InteropHistoryView'

interface Props extends AppLayoutProps {
  interopChains: InteropChainWithIcon[]
  initialSelection: InteropSelection
}

export function InteropHistoryPage({
  interopChains,
  initialSelection,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <InteropSelectedChainsProvider
        interopChains={interopChains}
        initialSelection={initialSelection}
      >
        <SideNavLayout variant="wide">
          <MainPageHeader>Interop history</MainPageHeader>
          <div className="flex flex-col gap-5">
            <HistoryIntro />
            <MultiChainSelector chains={interopChains} />
            <InteropHistoryView interopChains={interopChains} />
            <HistoryMethodology />
          </div>
        </SideNavLayout>
      </InteropSelectedChainsProvider>
    </AppLayout>
  )
}

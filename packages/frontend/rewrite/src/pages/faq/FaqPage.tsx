import { TooltipProvider } from '@radix-ui/react-tooltip'
import {
  GlossaryContextProvider,
  GlossaryTermWithoutDescription,
} from '~/components/markdown/glossary-context'
import { RecategorisationPreviewContextProvider } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { SearchBarContextProvider } from '~/components/search-bar/search-bar-context'
import { SearchBarProject } from '~/components/search-bar/search-bar-entry'
import _FaqPage from '../../../../src/app/(side-nav)/faq/page'

export interface FaqPageProps {
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
}

export function FaqPage(props: FaqPageProps) {
  return (
    <TooltipProvider delayDuration={300} disableHoverableContent>
      <GlossaryContextProvider terms={props.terms}>
        <SearchBarContextProvider projects={props.searchBarProjects}>
          <RecategorisationPreviewContextProvider>
            <_FaqPage />
          </RecategorisationPreviewContextProvider>
        </SearchBarContextProvider>
      </GlossaryContextProvider>
    </TooltipProvider>
  )
}

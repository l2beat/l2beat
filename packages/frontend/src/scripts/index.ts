import { configureCharts } from './charts'
import { configureAccordions } from './configureAccordions'
import { configureAlphabetSelectors } from './configureAlphabetSelectors'
import { configureBridgesAndCombinedOnly } from './configureBridgesAndCombinedOnly'
import { configureCopyButtons } from './configureCopyButtons'
import { configureCostsControlsWrappers } from './configureCostsControlsWrappers'
import { configureEtherscanLinks } from './configureEtherscanLinks'
import { configureExcludeAssociatedTokensCheckbox } from './configureExcludeAssociatedTokensCheckbox'
import { configureExpandableContainer } from './configureExpandableContainer'
import { configureFloatingBanner } from './configureFloatingBanner'
import { configureGlossarySideNav } from './configureGlossarySideNav'
import { configureHoverableDropdown } from './configureHoverableDropdown'
import { configureLivenessTimeRangeControls } from './configureLivenessTimeRangeControls'
import { configureMultipleEscrowsButton } from './configureMultipleEscrowsButton'
import { configureNavWrapper } from './configureNavWrapper'
import { configureOverflowWrappers } from './configureOverflowWrappers'
import { configureProjectFilters } from './configureProjectFilters'
import { configureRichSelects } from './configureRichSelect'
import { configureRosetteOverlay } from './configureRosetteOverlay'
import { configureScrollToTopButton } from './configureScrollToTopButton'
import { configureTabs } from './configureTabs'
import { configureThemeToggle } from './configureThemeToggle'
import { configureTooltips } from './configureTooltips'
import { configureUpgradeDescriptions } from './configureUpgradeDescriptions'
import { configureProjectNavigation } from './section-navigation'
import { configureSorting } from './table/configureSorting'
import { configureTables } from './table/configureTables'

const { onTimeRangeChange, onUnitChange } = configureCostsControlsWrappers()

configureCharts({
  callbacks: {
    onTimeRangeChange,
    onUnitChange,
  },
})

configureThemeToggle()
configureFloatingBanner()
configureTables()
configureProjectFilters()
configureTooltips()
configureAccordions()
configureRosetteOverlay()
configureHoverableDropdown()
configureProjectNavigation()
configureExpandableContainer()
configureTabs()
configureUpgradeDescriptions()
configureMultipleEscrowsButton()
configureRichSelects()
configureBridgesAndCombinedOnly()
configureLivenessTimeRangeControls()
configureOverflowWrappers()
configureSorting()
configureEtherscanLinks()
configureAlphabetSelectors()
configureScrollToTopButton()
configureGlossarySideNav()
configureCopyButtons()
configureNavWrapper()
configureExcludeAssociatedTokensCheckbox()

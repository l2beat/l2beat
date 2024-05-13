import { configureCharts } from './charts'
import { configureAccordions } from './configureAccordions'
import { configureBridgesAndCombinedOnly } from './configureBridgesAndCombinedOnly'
import { configureCostsControlsWrappers } from './configureCostsControlsWrappers'
import { configureEtherscanLinks } from './configureEtherscanLinks'
import { configureExpandableContainer } from './configureExpandableContainer'
import { configureFloatingBanner } from './configureFloatingBanner'
import { configureHoverableDropdown } from './configureHoverableDropdown'
import { configureLivenessTimeRangeControls } from './configureLivenessTimeRangeControls'
import { configureMultipleEscrowsButton } from './configureMultipleEscrowsButton'
import { configureOverflowWrappers } from './configureOverflowWrappers'
import { configureProjectFilters } from './configureProjectFilters'
import { configureRichSelects } from './configureRichSelect'
import { configureRosetteOverlay } from './configureRosetteOverlay'
import { configureSidebarMenu } from './configureSidebarMenu'
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
configureSidebarMenu()
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

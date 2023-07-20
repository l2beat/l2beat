import { configureCharts } from '../components/chart/configure'
import { configureTvlActivity } from '../components/header/configureTvlActivity'
import { configureDarkThemeToggle } from '../components/navbar/configureDarkThemeToggle'
import { configureSidebarMenu } from '../components/navbar/configureSidebarMenu'
import { configureCanonicalBridgesFilter } from './configureCanonicalBridgesFilter'
import { configureDropdowns } from './configureDropdowns'
import { configureExpandableContainer } from './configureExpandableContainer'
import { configureHoverableDropdown } from './configureHoverableDropdown'
import { configureReport } from './configureReport'
import { configureRosetteOverlay } from './configureRosetteOverlay'
import { configureTableIndexRerender } from './configureTableIndexRerender'
import { configureTabs } from './configureTabs'
import { configureTooltips } from './configureTooltips'
import { configureUpgradeDescriptions } from './configureUpgradeDescriptions'
import { configureProjectNavigation } from './section-navigation'

configureDarkThemeToggle()
configureSidebarMenu()
configureTooltips()
configureCharts()
configureTvlActivity()
configureDropdowns()
configureRosetteOverlay()
configureReport()
configureHoverableDropdown()
configureProjectNavigation()
configureExpandableContainer()
configureTabs()
configureCanonicalBridgesFilter()
configureTableIndexRerender()
configureUpgradeDescriptions()

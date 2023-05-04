import { configureCharts } from '../components/chart/configure'
import { configureTvlActivity } from '../components/header/configureTvlActivity'
import { configureDarkThemeToggle } from '../components/navbar/configureDarkThemeToggle'
import { configureSidebarMenu } from '../components/navbar/configureSidebarMenu'
import { configureDropdowns } from './configureDropdowns'
import { configureExpandableContainer } from './configureExpandableContainer'
import { configureFilters } from './configureFilters'
import { configureHoverableDropdown } from './configureHoverableDropdown'
import { configureRosetteOverlay } from './configureRosetteOverlay'
import { configureTooltips } from './configureTooltips'
import { configureProjectNavigation } from './section-navigation'

configureFilters()
configureDarkThemeToggle()
configureSidebarMenu()
configureTooltips()
configureCharts()
configureTvlActivity()
configureDropdowns()
configureRosetteOverlay()
configureHoverableDropdown()
configureProjectNavigation()
configureExpandableContainer()

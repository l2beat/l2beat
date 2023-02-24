import { configureCharts } from '../components/chart/configure'
import { configureTvlActivity } from '../components/header/configureTvlActivity'
import { configureDarkThemeToggle } from '../components/navbar/configureDarkThemeToggle'
import { configureSidebarMenu } from '../components/navbar/configureSidebarMenu'
import { configureFilters } from './configureFilters'
import { configureTooltips } from './configureTooltips'

configureFilters()
configureDarkThemeToggle()
configureSidebarMenu()
configureTooltips()
configureCharts()
configureTvlActivity()

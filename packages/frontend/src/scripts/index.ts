import { configureChart } from '../components/chart/configure'
import { configureDarkThemeToggle } from '../components/navbar/configureDarkThemeToggle'
import { configureSidebarMenu } from '../components/navbar/configureSidebarMenu'
import { configureCombinedBridges } from './configureCombinedBridges'
import { configureTooltips } from './configureTooltips'
import { configureTvlActivity } from './configureTvlActivity'

configureCombinedBridges()
configureDarkThemeToggle()
configureSidebarMenu()
configureTooltips()
configureChart()
configureTvlActivity()

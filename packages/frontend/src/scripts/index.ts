import { configureChart } from '../components/chart/configure'
import { configureDarkThemeToggle } from '../components/navbar/configureDarkThemeToggle'
import { configureSidebarMenu } from '../components/navbar/configureSidebarMenu'
import { configureCombinedBridges } from './configureCombinedBridges'
import { configureTooltips } from './configureTooltips'

configureCombinedBridges()
configureDarkThemeToggle()
configureSidebarMenu()
configureTooltips()
configureChart()

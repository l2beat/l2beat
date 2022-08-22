import { Story } from '@storybook/react'
import React from 'react'

import { Navbar as NavbarComponent } from '../components/Navbar'
import { StoryPage } from './utils/StoryPage'

export default {
  title: 'Components/Navbar',
  component: NavbarComponent,
}

const Template = () => (
  <StoryPage>
    <NavbarComponent />
  </StoryPage>
)
export const Navbar: Story = Template.bind({})
Navbar.parameters = {
  controls: { hideNoControlsWarning: true },
  layout: 'fullscreen',
}

import { Story } from '@storybook/react'
import React from 'react'

import { Footer as FooterComponent } from '../../components/Footer'
import { StoryPage } from '../utils/StoryPage'

export default {
  title: 'Components/Footer',
  component: FooterComponent,
}

const Template = () => (
  <StoryPage>
    <FooterComponent />
  </StoryPage>
)
export const Footer: Story = Template.bind({})
Footer.parameters = {
  controls: { hideNoControlsWarning: true },
  layout: 'fullscreen',
}

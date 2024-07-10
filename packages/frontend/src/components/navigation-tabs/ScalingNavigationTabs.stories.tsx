import { Meta, StoryObj } from '@storybook/react';

import { ScalingNavigationTabs as ScalingNavigationTabsComponent } from './ScalingNavigationTabs';

const meta: Meta<typeof ScalingNavigationTabsComponent> = {
  component: ScalingNavigationTabsComponent,
};
export default meta;
type Story = StoryObj<typeof ScalingNavigationTabsComponent>;

export const ScalingNavigationTabs: Story = {
  args: {
    selected: 'summary',
    features: {
      liveness: true,
      finality: true,
      activity: true,
      costsPage: true,
      banner: false,
      tvlBreakdown: false,
      implementationChange: false,
      gitcoinOption: false,
      hiringBadge: false,
      buildAllProjectPages: false,
      tvl: false,
      layer3sTvl: false,
      badges: true,
    },
  },
  argTypes: {
    selected: {
      control: 'radio',
      options: ['summary', 'risk', 'activity', 'liveness', 'finality', 'tvl'],
    },
  },
};

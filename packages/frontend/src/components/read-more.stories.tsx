import type { Meta, StoryObj } from '@storybook/react'
import { ReadMore } from './read-more'

const meta = {
  title: 'Components/Read More',
  component: ReadMore,
} satisfies Meta<typeof ReadMore>
export default meta

type Story = StoryObj<typeof meta>

export const LongText: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat tempus nisi sit amet rhoncus. Donec rhoncus pulvinar velit vitae blandit. Nullam maximus elit ut purus varius, vel aliquet nulla commodo. Aenean scelerisque malesuada odio placerat sagittis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque tincidunt lacus sit amet mauris ornare, in consequat nisi egestas. Quisque venenatis tellus lectus. Nam et arcu vel arcu gravida ornare eu in sapien. In hac habitasse platea dictumst. Sed sollicitudin dignissim quam, quis bibendum nisl cursus feugiat. Aliquam erat volutpat. Quisque sit amet augue libero. Suspendisse at ligula dictum, vestibulum orci at, blandit ex. Praesent tristique pellentesque ultrices. Nulla sit amet facilisis tortor. Ut in odio vestibulum, aliquet lorem vel, hendrerit justo. Suspendisse quis metus arcu. Donec molestie quam volutpat nisi varius, nec auctor lectus sodales. Etiam eget porta elit.',
  },
}

export const ShortText: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat tempus nisi sit amet rhoncus. Donec rhoncus pulvinar velit vitae blandit.',
  },
}

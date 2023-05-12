import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureTabs } from '../scripts/configureTabs'
import { Tabs } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>
export default meta

type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  args: {
    items: [
      {
        id: 'example-id',
        name: 'Example item',
        shortName: 'Example',
        content: (
          <span>
            Voluptate dolor ullamco excepteur irure duis aliquip voluptate. Ex
            magna ipsum et esse sit nostrud anim. Sunt aliqua ut mollit aute
            laborum veniam ipsum aliquip commodo Lorem. Elit sunt ex cupidatat
            enim ut elit. Ex occaecat tempor tempor commodo anim mollit et elit
            nisi reprehenderit est cillum. Esse eu cupidatat aute fugiat ea elit
            enim ea dolor minim pariatur esse. Id mollit fugiat ullamco in
            aliquip proident. Velit mollit culpa id ea culpa. Laboris nisi ut
            adipisicing incididunt ipsum eiusmod fugiat adipisicing est ea nisi
            elit consectetur. Consequat qui fugiat in sunt veniam sint et.
            Laboris enim dolore do esse esse veniam. Enim sit id et incididunt
            fugiat duis culpa sint minim consectetur sint commodo eu. Amet
            excepteur excepteur laboris irure.
          </span>
        ),
      },
      {
        id: 'example-id-2',
        name: 'Example item 2',
        shortName: 'Example 2',
        content: (
          <span>
            Nisi qui incididunt Lorem sint ea do sint eu labore. Eiusmod culpa
            sint nulla adipisicing labore adipisicing cillum. Incididunt commodo
            excepteur anim in. Nisi ut incididunt cillum do commodo commodo
            aliqua sint irure pariatur nisi. Ipsum culpa voluptate sit tempor
            mollit magna ea. Proident fugiat adipisicing consectetur velit
            pariatur mollit culpa sunt aute veniam.
          </span>
        ),
      },
    ],
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTabs()
      }, [])
      return (
        <div className="p-4">
          <Story />
        </div>
      )
    },
  ],
}

import { TabInfoWithDrawer } from '~/components/TabInfoWithDrawer'

export function PublicSystemInfo() {
  return (
    <TabInfoWithDrawer
      title="What are public DA layers?"
      content="Public DA layers are data availability solutions designed for broad,
      general use across multiple scaling projects. These solutions aim to be
      flexible, scalable, and accessible to a wide range of users without
      significant modifications or integration efforts."
    />
  )
}

export function CustomSystemInfo() {
  return (
    <TabInfoWithDrawer
      title="What are custom DA layers?"
      content="Custom DA layers are data availability solutions that are tightly
      integrated with a single scaling project and would require substantial
      modifications for public use. They are tailored to the specific needs of
      one project, making them less adaptable for general or broader
      applications."
    />
  )
}

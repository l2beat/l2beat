export function PublicSystemInfo() {
  return (
    <Info>
      Public DA layers are data availability solutions designed for broad,
      general use across multiple scaling projects. These solutions aim to be
      flexible, scalable, and accessible to a wide range of users without
      significant modifications or integration efforts.
    </Info>
  )
}

export function CustomSystemInfo() {
  return (
    <Info>
      Custom DA layers are data availability solutions that are tightly
      integrated with a single scaling project and would require substantial
      modifications for public use. They are tailored to the specific needs of
      one project, making them less adaptable for general or broader
      applications.
    </Info>
  )
}

function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex flex-row">
      <span className="text-[11px] leading-snug text-zinc-500 dark:text-secondary md:text-[13px] md:leading-tight">
        {children}
      </span>
    </div>
  )
}

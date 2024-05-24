export function SocialLinks() {
  return (
    <>
      <li>
        <PlainLink href={config.links.twitter} title="Twitter">
          <TwitterIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.discord} title="Discord">
          <DiscordIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.github} title="Github">
          <GithubIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.linkedin} title="LinkedIn">
          <LinkedInIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.youTube} title="YouTube">
          <YouTubeIcon />
        </PlainLink>
      </li>
      <li>
        <PlainLink href={config.links.medium} title="Medium">
          <MediumIcon />
        </PlainLink>
      </li>
    </>
  )
}

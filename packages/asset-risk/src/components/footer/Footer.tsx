export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 dark:border-gray-850">
      <div className="max-w-[1216px] mx-auto flex grid-cols-3 flex-col gap-4 px-4 md:grid md:px-12">
        <p className="text-center text-sm font-medium md:text-left">
          Made with 💗 by the L2BEAT research team.{' '}
          <br className="hidden lg:inline" />
          Support us by{' '}
          <a
            className='group cursor-pointer data-[state=highlighted]:relative data-[state=highlighted]:z-10 data-[state=highlighted]:before:absolute data-[state=highlighted]:before:-left-1 data-[state=highlighted]:before:-top-0.5 data-[state=highlighted]:before:-bottom-0.5 data-[state=highlighted]:before:-right-1 data-[state=highlighted]:before:rounded data-[state=highlighted]:before:-z-10 data-[state=highlighted]:before:border data-[state=highlighted]:before:border-dashed data-[state=highlighted]:before:border-yellow-700 data-[state=highlighted]:before:bg-yellow-250/50 data-[state=highlighted]:before:content-[""] data-[state=highlighted]:before:dark:border-yellow-250 data-[state=highlighted]:before:dark:bg-yellow-250/10'
            href="/donate"
          >
            <span className="inline-flex items-center font-semibold transition-colors text-blue-700 group-hover:text-blue-550 dark:text-blue-500">
              <span className="flex items-center gap-1 underline">
                donating
              </span>
            </span>
          </a>
          .
        </p>
        <ul className="flex w-full justify-center gap-4">
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://twitter.com/l2beat"
              title="Twitter"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                role="img"
                aria-label="X logo"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://discord.gg/eaVKXPmtWk"
              title="Discord"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                role="img"
                aria-label="Discord logo"
              >
                <path
                  fillRule="evenodd"
                  d="M20.32 4.66C18.79 3.95 17.15 3.44 15.43 3.14C15.4 3.13 15.37 3.15 15.35 3.18C15.14 3.55 14.91 4.04 14.75 4.43C12.9 4.15 11.07 4.15 9.26 4.43C9.09 4.03 8.85 3.55 8.64 3.18C8.62 3.15 8.59 3.14 8.56 3.14C6.85 3.44 5.21 3.95 3.68 4.66C3.66 4.66 3.65 4.67 3.64 4.68C0.53 9.33 -0.32 13.87 0.1 18.34C0.1 18.37 0.11 18.39 0.13 18.4C2.18 19.91 4.17 20.82 6.12 21.43C6.15 21.44 6.19 21.43 6.21 21.4C6.67 20.77 7.08 20.11 7.43 19.41C7.45 19.37 7.43 19.32 7.39 19.3C6.74 19.05 6.12 18.75 5.52 18.41C5.47 18.38 5.47 18.31 5.51 18.28C5.64 18.19 5.76 18.09 5.88 17.99C5.91 17.97 5.94 17.97 5.96 17.98C9.89 19.77 14.14 19.77 18.02 17.98C18.05 17.97 18.08 17.97 18.1 17.99C18.22 18.09 18.35 18.19 18.47 18.28C18.52 18.31 18.51 18.38 18.47 18.41C17.87 18.76 17.25 19.05 16.59 19.3C16.55 19.32 16.53 19.37 16.55 19.41C16.91 20.11 17.33 20.77 17.78 21.4C17.8 21.43 17.83 21.44 17.86 21.43C19.82 20.82 21.81 19.91 23.87 18.4C23.88 18.39 23.89 18.37 23.9 18.34C24.4 13.17 23.06 8.67 20.35 4.68C20.34 4.67 20.33 4.66 20.32 4.66ZM8.02 15.62C6.84 15.62 5.86 14.53 5.86 13.2C5.86 11.86 6.82 10.78 8.02 10.78C9.23 10.78 10.2 11.87 10.18 13.2C10.18 14.53 9.22 15.62 8.02 15.62ZM15.99 15.62C14.81 15.62 13.84 14.53 13.84 13.2C13.84 11.86 14.79 10.78 15.99 10.78C17.21 10.78 18.17 11.87 18.15 13.2C18.15 14.53 17.21 15.62 15.99 15.62Z"
                ></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/l2beat/l2beat"
              title="Github"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                role="img"
                aria-label="Github logo"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.linkedin.com/company/l2beat/"
              title="LinkedIn"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                role="img"
                aria-label="LinkedIn logo"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.youtube.com/channel/UCDrl-fNXFjOoykr4lQij9BA/videos"
              title="YouTube"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                role="img"
                aria-label="YouTube logo"
              >
                <path d="M19.615 3.184C16.011 2.938 7.984 2.939 4.385 3.184C0.488 3.45 0.029 5.804 0 12C0.029 18.185 0.484 20.549 4.385 20.816C7.985 21.061 16.011 21.062 19.615 20.816C23.512 20.55 23.971 18.196 24 12C23.971 5.815 23.516 3.451 19.615 3.184ZM9 16V8L17 11.993L9 16Z"></path>
              </svg>
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://medium.com/l2beat"
              title="Medium"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 15"
                fill="currentColor"
                role="img"
                aria-label="Medium logo"
              >
                <path d="M6.8 0.600098C5.90701 0.600098 5.02277 0.775985 4.19775 1.11772C3.37274 1.45945 2.62311 1.96033 1.99167 2.59177C1.36024 3.22321 0.859351 3.97284 0.517619 4.79785C0.175887 5.62286 0 6.50711 0 7.4001C0 8.29309 0.175887 9.17733 0.517619 10.0023C0.859351 10.8274 1.36024 11.577 1.99167 12.2084C2.62311 12.8399 3.37274 13.3407 4.19775 13.6825C5.02277 14.0242 5.90701 14.2001 6.8 14.2001C7.69299 14.2001 8.57723 14.0242 9.40225 13.6825C10.2273 13.3407 10.9769 12.8399 11.6083 12.2084C12.2398 11.577 12.7406 10.8274 13.0824 10.0023C13.4241 9.17733 13.6 8.29309 13.6 7.4001C13.6 6.50711 13.4241 5.62286 13.0824 4.79785C12.7406 3.97284 12.2398 3.22321 11.6083 2.59177C10.9769 1.96033 10.2273 1.45945 9.40225 1.11772C8.57723 0.775985 7.69299 0.600098 6.8 0.600098ZM17.6 1.4001C17.1798 1.4001 16.7637 1.55529 16.3754 1.85682C15.9872 2.15835 15.6344 2.60031 15.3373 3.15746C15.0401 3.71461 14.8044 4.37604 14.6436 5.104C14.4828 5.83195 14.4 6.61217 14.4 7.4001C14.4 8.18803 14.4828 8.96824 14.6436 9.6962C14.8044 10.4242 15.0401 11.0856 15.3373 11.6427C15.6344 12.1999 15.9872 12.6418 16.3754 12.9434C16.7637 13.2449 17.1798 13.4001 17.6 13.4001C18.0202 13.4001 18.4363 13.2449 18.8246 12.9434C19.2128 12.6418 19.5656 12.1999 19.8627 11.6427C20.1599 11.0856 20.3956 10.4242 20.5564 9.6962C20.7172 8.96824 20.8 8.18803 20.8 7.4001C20.8 6.61217 20.7172 5.83195 20.5564 5.104C20.3956 4.37604 20.1599 3.71461 19.8627 3.15746C19.5656 2.60031 19.2128 2.15835 18.8246 1.85682C18.4363 1.55529 18.0202 1.4001 17.6 1.4001ZM22.8 2.2001C22.4817 2.2001 22.1765 2.74795 21.9515 3.72314C21.7264 4.69833 21.6 6.02097 21.6 7.4001C21.6 8.77922 21.7264 10.1019 21.9515 11.0771C22.1765 12.0522 22.4817 12.6001 22.8 12.6001C23.1183 12.6001 23.4235 12.0522 23.6485 11.0771C23.8736 10.1019 24 8.77922 24 7.4001C24 6.02097 23.8736 4.69833 23.6485 3.72314C23.4235 2.74795 23.1183 2.2001 22.8 2.2001Z"></path>
              </svg>
            </a>
          </li>
        </ul>
        <p className="text-center text-sm font-medium md:text-right">
          Copyright 2024 L2BEAT
        </p>
      </div>
    </footer>
  )
}

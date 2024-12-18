# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT=22-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:dev-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get -y install --no-install-recommends \
    ca-certificates fonts-liberation gconf-service libc6 libcairo2 libcups2 \
    libdbus-1-3 libexpat1 libfontconfig1 libgconf-2-4 libgdk-pixbuf2.0-0 libgdb-dev \
    libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 \
    libstdc++6 libx11-6 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
    libxfixes3 libxft2 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release \
    postgresql-client wget xdg-utils


# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"

These steps rebuild the Tornado Cash app that tornadocash.eth pins and recompute its IPFS hash, `bafybeiayu2srl6owm6tdbik6uabcpjlji4u32dtph4yrwakreklcfprkou`. They follow the DAO's [recipe](https://github.com/tornado-dao/tornado-ipfs-ui/tree/d2aa401746e1b1195ff692a051636b8c5c43d2e5) with two download fixes: Debian packages come from archive.debian.org, and kubo comes from its GitHub release, checked against the published sha512. The app's build steps run without network.

1. Install Docker with BuildKit, the default since Docker 23. Save this `Dockerfile` in an empty directory:

```dockerfile
# node:20.15.0-bullseye-slim, the base of the DAO recipe
FROM node@sha256:8f6881869150049f8f1228a2f828c3dc1d0a012f136175f02ae46a83c0a1002b

# Debian 11 moved to archive.debian.org
RUN sed -i -e 's|deb.debian.org|archive.debian.org|g' -e '/bullseye-updates/d' /etc/apt/sources.list \
  && apt-get update && apt-get install --yes --no-install-recommends wget git ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# kubo v0.29.0 from its GitHub release, checked against the published sha512
WORKDIR /home/root
RUN wget -q https://github.com/ipfs/kubo/releases/download/v0.29.0/kubo_v0.29.0_linux-amd64.tar.gz \
  && echo "2df5191393e0dee5e7a6f301d56a3f9d19041dd4076bb78483af042fed3b107a08968c6853b5b84f3699139b1527556f9c812e6924ea079e8be5909dc77fe65b  kubo_v0.29.0_linux-amd64.tar.gz" | sha512sum -c - \
  && tar -xzf kubo_v0.29.0_linux-amd64.tar.gz && ./kubo/install.sh && rm -rf kubo kubo_v0.29.0_linux-amd64.tar.gz \
  && ipfs init

# the commit that proposal 73 pinned
ENV GIT_REPOSITORY=https://github.com/torndao777-eng/classic-ui.git
ENV GIT_COMMIT_HASH=8af0abd14d7eeb734f943b968ce687cb5946eac6
WORKDIR /app
RUN git init && git remote add origin $GIT_REPOSITORY \
  && git fetch --depth 1 origin $GIT_COMMIT_HASH && git checkout $GIT_COMMIT_HASH

# dependencies are fetched online without install scripts, the build runs offline
RUN yarn install --frozen-lockfile --ignore-scripts
RUN --network=none yarn build:lts
RUN --network=none yarn generate:lts
RUN --network=none ipfs add --cid-version 1 --quieter --only-hash --recursive ./dist > ipfs_hash.txt && cat ipfs_hash.txt
```

2. Build it. This takes about 4 minutes:

```bash
docker build -t tornado-app-rebuild .
docker run --rm --entrypoint cat tornado-app-rebuild /app/ipfs_hash.txt
```

3. Compare the printed hash with the contenthash of tornadocash.eth in its [ENS records](https://app.ens.domains/tornadocash.eth?tab=records). They must be equal.


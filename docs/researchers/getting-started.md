# Getting Started

This guide walks you through setting up Defi Disco and analyzing your first DeFi protocol with our tool.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/deficollective/defi-disco.git
cd defi-disco
pnpm i
cd packages/l2b
pnpm l2bup
```

## Configuration

### Environment Setup

Create a `.env` file inside the `packages/config` folder:

```bash
cd ../config
```

Add the following environment variables to `.env`:

```env
ETHERSCAN_API_KEY=your_etherscan_api_key
ETHEREUM_RPC_URL_FOR_DISCOVERY=https://your-rpc-url
```

### Project Configuration

1. Create a new project folder inside `./packages/config/src/projects`:

```bash
mkdir -p src/projects/euler-v2
```

2. Create a `config.jsonc` file in your project folder:

```jsonc
{
  "$schema": "../../../../discovery/schemas/config.v2.schema.json",
  "name": "euler-v2",
  "import": ["../globalConfig.jsonc"],
  "initialAddresses": ["eth:0x35400831044167E9E2DE613d26515eeE37e30a1b"],
  "defidisco": {
    "scanPermissions": false,
    "permissionLimits": {
      "maxSourceFiles": 35
    }
  },
  "overrides": {
    "eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84": {
      "ignoreDiscovery": true
    }
  }
}
```

## Running Discovery

Execute the discovery process from the `packages/config` directory:

```bash
l2b discover euler-v2
```

**Note:** Discovery must always be run from the `./packages/config` directory.

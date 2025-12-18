# DeFiScan Endpoints Service

DeFi position and balance analysis API service for DefidDisco.

## Features

- Token balance queries with USD values
- DeFi position aggregation across protocols
- In-memory caching with configurable TTL
- Rate limiting and retry logic
- DeBank integration (extensible to other providers)

## Installation

```bash
cd packages/defiscan-endpoints
pnpm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your DeBank API key
```

## Development

```bash
pnpm dev
```

## Production

```bash
pnpm build
pnpm start
```

## API Endpoints

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-27T12:00:00Z",
  "version": "0.1.0"
}
```

### GET /balances
Get token balances for a contract

**Query Parameters:**
- `contract_address` (required): Contract address to query
- `asset_addresses` (optional): Comma-separated list of token addresses
- `chain_id` (optional): Blockchain identifier (defaults to 'eth' for Ethereum mainnet)

**Example:**
```bash
curl "http://localhost:3001/balances?contract_address=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
# With chain ID
curl "http://localhost:3001/balances?contract_address=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&chain_id=eth"
```

### GET /positions
Get DeFi positions for an address (returns raw DeBank complex protocol data)

**Query Parameters:**
- `address` (required): Wallet or contract address to query
- `chain_id` (optional): Blockchain identifier (defaults to 'eth' for Ethereum mainnet)

**Response:**
Returns an array of DeBank complex protocol objects. The response structure may be customized in the future.

**Example:**
```bash
curl "http://localhost:3001/positions?address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
# With chain ID
curl "http://localhost:3001/positions?address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&chain_id=eth"
```

## Testing

```bash
# Health check
curl http://localhost:3001/health

# Get balances
curl "http://localhost:3001/balances?contract_address=0x..."

# Get positions
curl "http://localhost:3001/positions?address=0x..."
```

## Architecture

- **Express**: HTTP server
- **ClientCore**: Rate limiting, retries, logging
- **DeBank**: Primary data source
- **Cache**: In-memory with TTL

## Future Enhancements

- Add support for additional data providers
- Implement persistent caching (Redis)
- Add authentication/API keys
- Add metrics and monitoring endpoints

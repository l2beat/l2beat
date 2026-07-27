# Architecture

Fusion+ is an intent-based atomic swap protocol. A user signs an order for tokens on the source chain. A resolver fills it through the 1inch Limit Order Protocol, moving the user's tokens into a deterministic source-chain escrow and supplying a safety deposit. The resolver then supplies the requested tokens and another safety deposit to a matching destination-chain escrow.

The escrows do not communicate across chains. They are linked by matching swap parameters and the hash of a secret held by the user. If the source order is never filled, no escrow is created and the user's tokens remain in their wallet.

# Settlement

After verifying the destination-chain deposit, the user reveals the secret. It releases the destination-chain tokens to the user and the source-chain tokens to the resolver. The caller of each withdrawal receives that escrow's safety deposit. During later public periods, a Resolver Access Token (RES) holder can execute withdrawals, but cannot change their fixed token recipients.

# Recovery

A standard HTLC lets each depositor reclaim their own funds after a timeout. Fusion+ does not give this right to the user who supplied the source-chain deposit. The filling resolver must cancel the source escrow to return the tokens to the user, or a RES holder can do so after a later timeout. The safety deposit rewards the caller for executing this recovery on the user's behalf.

If neither acts, the user's deposit can remain frozen. In the discovered Ethereum deployment, after eight days the filling resolver can rescue any remaining source-chain tokens to itself. On the destination chain, the resolver is the depositor and can cancel to recover its own tokens after the destination timeout.

# Resolver access and control

Each order contains a timed resolver whitelist. A listed resolver can fill without a RES NFT once its assigned time begins. After the order's general access time, a non-listed resolver needs an owner-issued RES NFT. The NFT also gates public withdrawals and source-chain cancellation.

The Fusion+ factory and escrow implementations are immutable. The RES NFT owner controls NFT-based resolver access and the public recovery paths, while the owner of the shared Limit Order Protocol can pause new source-chain fills.

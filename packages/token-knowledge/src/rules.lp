% Token Knowledge - Inference Rules
% Facts are in the form: transfer(SrcChain, SrcAddr, DstChain, DstAddr, Plugin, BridgeType).
%  transfer(Chain, Address, ChainB, AddresssB, _, lockAndMint).

% cgId(Chain, Address, CoingeckoId) :-
%  cgId(ChainB, AddressB, CoingeckoId),
%  transfer(ChainB, AddressB, Chain, Addresss, _, lockAndMint).

% Two tokens are the same if connected by a canonical bridge (lockAndMint or burnAndMint).
sameAbstract(SC, SA, DC, DA) :- transfer(SC, SA, DC, DA, _, lockAndMint).
%  sameAbstract(SC, SA, DC, DA) :- transfer(SC, SA, DC, DA, _, burnAndMint).
 
% sameAbstract is transitive: if A=B and B=C then A=C.
sameAbstract(C1, T1, C3, T3) :- sameAbstract(C1, T1, C2, T2), sameAbstract(C2, T2, C3, T3).
 
% sameAbstract is symmetric: if A=B then B=A.
sameAbstract(C2, T2, C1, T1) :- sameAbstract(C1, T1, C2, T2).

% cgId (coingeckoId) is the same if both tokens are sameAbstract
cgId(C, A, CoingeckoId) :- cgId(C2, A2, CoingeckoId), sameAbstract(C, A, C2, A2).

cgId(base, "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", "usd-coin").
cgId(base, "0xc3de830ea07524a0761646a6a4e4be0e114a3c83", "uniswap").

#show cgId/3.

%#show sameAbstract/4.
 
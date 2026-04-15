% Token Knowledge - Inference Rules

% imported transfers are in the form:
% transfer(SrcChain, SrcAddr, DstChain, DstAddr, Plugin, BridgeType).

% Two tokens have the same abstract token
% if there was a nonMinting transfer between them
sameAbstract(SC, SA, DC, DA) :- 
  SC != DC, SA != DA, transfer(SC, SA, DC, DA, _, nonMinting).
 
% sameAbstract is transitive: if A=B and B=C then A=C.
sameAbstract(C1, A1, C3, A3) :- 
  C1 != C3, A1 != A3, sameAbstract(C1, A1, C2, A2), sameAbstract(C2, A2, C3, A3).

% sameAbstract is symmetric: if A=B then B=A.
sameAbstract(C2, A2, C1, A1) :-
  C1 != C2, A1 != A2, sameAbstract(C1, A1, C2, A2).

% cgId (coingeckoId) is the same if both tokens are sameAbstract
cgId(C, A, CoingeckoId) :- 
  cgId(C2, A2, CoingeckoId), sameAbstract(C, A, C2, A2).

% issuer is the same if both tokens are sameAbstract
issuer(C, A, Issuer) :- 
  issuer(C2, A2, Issuer), sameAbstract(C, A, C2, A2).

% some manualy added facts:
cgId(base, "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", "usd-coin").
issuer(base, "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", "Circle").
cgId(base, "0xc3de830ea07524a0761646a6a4e4be0e114a3c83", "uniswap").

token(SC, SA) :-transfer(SC, SA, _, _, _, _).
token(SC, SA) :-transfer(_, _, SC, SA, _, _).

#show cgId/3.
#show issuer/3.
#show token/2.
#show sameAbstract/4.

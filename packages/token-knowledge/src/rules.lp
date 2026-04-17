% Token Knowledge - Inference Rules

% tokens argumens are in the form: `t("Chain", "Address")

% imported transfers are in the form:
% transfer(t("SrcChain", "SrcAddr"), t("DstChain", "DstAddr"), "Plugin", "BridgeType").

% Two tokens have the same abstract token
% if there was a nonMinting transfer between them
sameAbstract(T1, T2) :- 
  transfer(T1, T2, _, "nonMinting").
 
% sameAbstract is transitive: if A=B and B=C then A=C.
sameAbstract(T1, T3) :- 
  T1 != T3, sameAbstract(T1, T2), sameAbstract(T2, T3).

% sameAbstract is symmetric: if A=B then B=A.
sameAbstract(T2, T1) :-
  sameAbstract(T1, T2).

% cgId (coingeckoId) is the same if both tokens are sameAbstract
cgId(T, CoingeckoId) :- 
  cgId(T2, CoingeckoId), sameAbstract(T, T2).

% issuer is the same if both tokens are sameAbstract
issuer(T, Issuer) :- 
  issuer(T2, Issuer), sameAbstract(T, T2).

% some manualy added facts:
cgId(t("base", "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"), "usd-coin").
issuer(t("base", "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"), "Circle").
cgId(t("base", "0xc3de830ea07524a0761646a6a4e4be0e114a3c83"), "uniswap").

#show sameAbstract/2.
#show cgId/2.
#show issuer/2.

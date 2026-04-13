% Token Knowledge - Inference Rules
% Facts are in the form: transfer(SrcChain, SrcAddr, DstChain, DstAddr, Plugin, BridgeType).

% Two tokens are the same if connected by a canonical bridge (lockAndMint or burnAndMint).
same_token(SC, SA, DC, DA) :- transfer(SC, SA, DC, DA, _, lockAndMint).
same_token(SC, SA, DC, DA) :- transfer(SC, SA, DC, DA, _, burnAndMint).

% same_token is transitive: if A=B and B=C then A=C.
same_token(C1, T1, C3, T3) :- same_token(C1, T1, C2, T2), same_token(C2, T2, C3, T3).

% same_token is symmetric: if A=B then B=A.
same_token(C2, T2, C1, T1) :- same_token(C1, T1, C2, T2).

#show same_token/4.

Ethereum's consensus protocol combines two separate consensus protocols, LMD GHOST and Casper FFG.
LMD GHOST is a fork choice rule that essentially provides liveness to the chain. On the other hand, Casper FFG provides finality to the chain, protecting it from deep reversions.
LMD GHOST provides the core of the chain fork choice rule, by selecting the Greedy Heaviest-Observed Sub-Tree (GHOST) and considering only the validators
most recent vote (Latest Message Driven, LMD). Casper FFG is a finality gadget, it modifies the fork choice by making some of the chain branches inaccessible.
Together they are known as "Gasper".

---
title: "🦴 Ossification 🦴"
shortTitle: "Ossification"
description: "Introducing the ossification score: an evidence-based metric built on an open dataset of EVM exploits, measuring how blockchain code hardens by securing value over time."
publishedOn: "2026-08-27"
authorId: l2beat_research
tag: Research
---

Research on traditional software in the wild suggests that code age can carry meaningful information about security: mature, unchanged code tends to be less vulnerable, while recent and extensive code changes are associated with more bugs ([Ozment & Schechter, 2006](https://www.usenix.org/conference/15th-usenix-security-symposium/milk-or-wine-does-software-security-improve-age); [Shin et al., 2011](https://ieeexplore.ieee.org/document/5560680); [Alexopoulos et al., 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/alexopoulos); [Meneely et al., 2013](https://www.computer.org/csdl/proceedings-article/esem/2013/5056a065/12OmNynJMDo)).

On blockchains like Ethereum, code age can be an even stronger signal because smart contracts are public, in an economically adversarial environment, and often directly secure substantial amounts of extractable value. We are therefore measuring **code ossification** as the accumulation of evidence that code has matured by successfully securing value over time.

[L2BEAT](https://l2beat.com/) watches projects onchain using our *disco update monitor,* a crawler that regularly queries smart contract code and state and alerts us about changes. To measure ossification, we define a perimeter of critical smart contracts and state for a given project and reset the projects’ 🦴-clock each time a critical upgrade or change is recorded. Since we also measure TVS per project over time, we can combine this data for some powerful new metrics.

We do not aim to feed you fugazi numbers though, so let us introduce the evidence backing our **ossification score.** The 0-100 🦴-score is directly based on a [open dataset of blockchain hacks](https://github.com/sekuba/ossification-dataset) that we are collecting and plan to maintain. Each incident in the dataset is reviewed as to its mechanism, age of the vulnerable configuration or source code and loss in USD. This allows us to generate a curve for the 🦴-score and gives it practical meaning:

> a score of 67 means that 67% of hacks with a loss of \>$1k targeted younger code

<iframe src="/files/ossification/charts.html#chart=curve" style="width:100%;height:480px;border:none" loading="lazy" title="The ossification curve: cumulative share of exploits and stolen USD by code age at exploit, with adjustable loss threshold"></iframe>

*The curve is heavily front-loaded, supporting our hypothesis that code ossifies (becomes safer with age). Drag the loss threshold to see how the curve holds its shape as small incidents are excluded.*

<iframe src="/files/ossification/charts.html#chart=sweep" style="width:100%;height:440px;border:none" loading="lazy" title="Threshold sweep: median code age at exploit and sample size as the loss admission floor rises"></iframe>

But vulnerable public code alone will not be exploited unless there is something to gain. Bones harden with regular strain, so we publish the ossification score in the context of a TVS integral, the **battle-tested exposure.** Similarly to e.g. watt-hours in physics, its dollar-years measure the dollar-time that the project's code withstood since its last critical change. This boosts projects with a low 🦴-score like Arbitrum or Base, revealing that their young code is likely under much more scrutiny than projects with lower TVS or a lower ‘bounty’.

Amazing, so ossification \= security, right? No. Although we are approaching security metrics, the new ossification metrics **do not measure**:

- *capability,* or if and how a smart contract can change (this is why we show you the exit window on the ossification summary page)  
- audits of the code  
- quantitative code-churn (although we are working on adding this)  
- anything that does not have to do with onchain code (e.g. key compromise)

Finally, here is every reviewed exploit in the dataset — hover a dot to see the incident behind it:

<iframe src="/files/ossification/charts.html#chart=scatter" style="width:100%;height:560px;border:none" loading="lazy" title="Every exploit in the dataset: incident loss versus code age at exploit, with adjustable loss threshold"></iframe>

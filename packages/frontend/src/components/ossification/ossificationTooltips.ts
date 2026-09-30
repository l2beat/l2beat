export const OSSIFICATION_TOOLTIPS = {
  score:
    "The project's critical smart contracts have stayed unchanged longer than the exploited code in N% of recorded incidents. Below 50: younger than the median exploited code. 80+: about a year unchanged. An unverified critical contract gates the score to zero.",
  timeline:
    'TVS over one year. The highlighted part is the ossified period — its area is the battle-tested exposure. Ticks below the baseline are earlier resets: critical changes to the smart contracts or deployments of new ones. Heights are normalized per-project.',
  exposure:
    'Value secured summed up over the ossified period — the implicit bug bounty the code has withstood, in dollar-years (Example: 6 months of constant 10M TVS without critical code changes gives a value of 5M, 3 years give 30M).',
  criticalChangesPerYear:
    'Critical change events per year over the trailing 36 months, or since the project launched if that is more recent, and the number of contracts in the critical perimeter as classified by our research team.',
  exitWindow:
    'How much time users have to exit before a permitted critical change takes effect. This does not directly affect ossification.',
  lastChange:
    'Time since the last critical change, or since the newest deployment if there was none.',
}

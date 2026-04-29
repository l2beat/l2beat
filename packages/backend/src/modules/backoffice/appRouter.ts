import type {
  AnyTRPCRouter,
  inferRouterInputs,
  inferRouterOutputs,
} from '@trpc/server'
import { router as createRouter } from '../../trpc/init'
import type { InteropTrpcRouter } from '../interop/engine/dashboard/trpc/router'
import type { TrpcContribution } from '../types'

/**
 * Manifest of every possible /trpc namespace this backend can expose.
 * Adding a new domain module that contributes /trpc is a single line here
 * (type-only — no runtime import). Runtime wiring happens in Application.ts.
 */
type BackendManifest = readonly [
  TrpcContribution<'interop', InteropTrpcRouter>,
  // TrpcContribution<'activity', ActivityTrpcRouter>,
]

type ContributionsToRouterMap<T extends readonly TrpcContribution[]> = {
  [K in T[number] as K['namespace']]: K['trpcRouter']
}

type BackendRouterMap = ContributionsToRouterMap<BackendManifest>

// Type anchor: tRPC's `router()` has overloaded signatures and
// `typeof createRouter<X>` instantiates the wrong one. Calling it through
// a synthetic function lets TS pick the overload that accepts AnyRouter
// values. Never invoked at runtime.
const _backendRouterTypeAnchor = () => createRouter({} as BackendRouterMap)
export type BackendRouter = ReturnType<typeof _backendRouterTypeAnchor>
export type BackendRouterInputs = inferRouterInputs<BackendRouter>
export type BackendRouterOutputs = inferRouterOutputs<BackendRouter>

/**
 * Builds the backend appRouter from a runtime list of contributions. The
 * returned router is typed against the full {@link BackendManifest} so the
 * FE always sees every possible namespace; namespaces missing at runtime
 * are short-circuited by the koa guard in BackofficeModule with a 503
 * MODULE_DISABLED response.
 */
export function createBackendAppRouter<
  T extends readonly TrpcContribution<string, AnyTRPCRouter>[],
>(contributions: T): BackendRouter {
  const map = Object.fromEntries(
    contributions.map((c) => [c.namespace, c.trpcRouter]),
  ) as ContributionsToRouterMap<T>
  return createRouter(map) as unknown as BackendRouter
}

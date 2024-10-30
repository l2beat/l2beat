import { expect, mockObject } from "earl";
import { HttpClient2 } from "./http/HttpClient2";
import { json } from "@l2beat/shared-pure";
import { Logger, RateLimiter } from "@l2beat/backend-tools";
import { RetryHandler } from "../tools";
import { ClientCore } from "./ClientCore";

describe(ClientCore.name, () => {
  describe(ClientCore.prototype.fetch.name, () => {
    it("Fetches URL with params and returns response", async () => {
      const { clientCore, http } = mocks();

      const response = await clientCore.fetch("https://api.test.com/data", { timeout: 1 });

      expect(response).toEqual({ result: 'success' });
      expect(http.fetch).toHaveBeenOnlyCalledWith("https://api.test.com/data", { timeout: 1 })
    });

    it("Applies rate limiting", async () => {
      const { clientCore, rateLimiter } = mocks();

      await clientCore.fetch("https://api.test.com/data", {});

      expect(rateLimiter.call).toHaveBeenCalledTimes(1);
    });

    it("Retries on error", async () => {
      const { clientCore, rateLimiter, retryHandler, http } = mocks();
      http.fetch.rejectsWithOnce(new Error("Network error"));

      await clientCore.fetch("https://api.test.com/data", {});

      expect(rateLimiter.call).toHaveBeenCalledTimes(2);
      expect(retryHandler.retry).toHaveBeenCalledTimes(1);
    });

    it("Throws on invalid response", async () => {
      const { clientCore, http, retryHandler } = mocks();
      http.fetch.resolvesToOnce(null);

      await clientCore.fetch("https://api.test.com/data", {});

      expect(retryHandler.retry).toHaveBeenCalledTimes(1);
    });
  });
});


function mocks() {
  const http = mockObject<HttpClient2>({
    fetch: async () => ({ result: 'success' }) as json,
  });

  const rateLimiter = mockObject<RateLimiter>({
    call: async (fn) => fn(),
  });

  const retryHandler = mockObject<RetryHandler>({
    retry: async (fn) => fn(),
  });

  const logger = mockObject<Logger>({});

  class TestClientCore extends ClientCore {
    validateResponse(response: unknown): boolean {
      return !!response;
    }
  }

  const clientCore = new TestClientCore({
    id: "test",
    http,
    rateLimiter,
    retryHandler,
    logger,
  });

  return {
    clientCore,
    http,
    rateLimiter,
    retryHandler,
    logger,
  };
}

import { HttpClient } from "@l2beat/shared";
import { RelayApiClient } from "./RelayApiClient";

main();

async function main() {
  const client = new RelayApiClient(new HttpClient());

  const idMap = new Set<string>();
  let lastTime = Math.floor(new Date().getTime() / 1000);
  while (true) {
    // await new Promise(r => setTimeout(r, 1000))
    const res = await client.getAllRequests({
      limit: 50,
      startTimestamp: lastTime,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    });
    console.log(
      '----',
      new Date(lastTime * 1000).toISOString(),
      res.requests.length,
      res.requests.filter((x) => x.status === "pending").length,
      "pending"
    );
    const last =
      res.requests.length > 0
        ? res.requests[0]
        : undefined;
    if (last) {
      lastTime = Math.floor(new Date(last.updatedAt).getTime() / 1000);
    }
    for (const [i, req] of res.requests.entries()) {
      console.log(i, req.id, req.createdAt, req.status)

      // if (req.status === "pending") {
      //   idMap.add(req.id);
      // } else {
      //   if (idMap.has(req.id)) {
      //     console.log("again");
      //   }
      // }
    }
  }
}

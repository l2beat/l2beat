import { Logger } from "@l2beat/common";
import { expect } from "earljs";

import { PriceRepository } from "../../../src/peripherals/database/PriceRepository";
import { setupDatabaseTestSuite } from "./setup";

describe(PriceRepository.name, () => {
  const { knex } = setupDatabaseTestSuite()

    it(PriceRepository.prototype.getAll.name,async () => {
        const repository = new PriceRepository(knex, Logger.SILENT)
        await repository.deleteAll()

        const results = await repository.getAll()

        expect(results).toEqual([])
    })

})
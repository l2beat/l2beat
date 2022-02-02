import { UnixTime } from "@l2beat/common";
import { expect } from "earljs";

import { CoingeckoQueryService, generateTimestampsList, Granularity } from "../../../src/peripherals/coingecko/CoingeckoQueryService";

describe(CoingeckoQueryService.name, () => {
})

describe(generateTimestampsList.name, () => {
    describe("hourly", () => {
        const GRANULARITY = Granularity.Hourly
        const FROM = new UnixTime(1643806800) //Wed Feb 02 2022 13:00:00 GMT+0000
        const TO = new UnixTime(1643814000) //Wed Feb 02 2022 15:00:00 GMT+0000

        const RESULT = [new Date(1643806800000), new Date(1643810400000), new Date(1643814000000)]

        it("empty if FROM greater than TO", () => {
            const result = generateTimestampsList(TO,FROM,GRANULARITY)
            expect(result).toEqual([])
        })

        it("empty if FROM is not a full hour", () => {
            const result = generateTimestampsList(FROM.add(1,"seconds"),TO,GRANULARITY)
            expect(result).toEqual([])
        })

        it("empty if TO is not a full hour", () => {
            const result = generateTimestampsList(FROM,TO.add(1,"seconds"),GRANULARITY)
            expect(result).toEqual([])
        })

        it("empty if FROM and TO are not a full hour", () => {
            const result = generateTimestampsList(FROM.add(1,"seconds"),TO.add(1,"seconds"),GRANULARITY)
            expect(result).toEqual([])
        })

        it("works from 13:00 to 15:00", () => {
            expect(generateTimestampsList(FROM,TO,GRANULARITY)).toEqual(RESULT)
        })

        it("works from 23:00 to 01:00", () => {
            const from = new UnixTime(1643842800) //Wed Feb 02 2022 23:00:00 GMT+0000
            const to = new UnixTime(1643850000) //Thu Feb 03 2022 01:00:00 GMT+0000
            const result = [new Date(1643842800000), new Date(1643846400000), new Date(1643850000000)]

            expect(generateTimestampsList(from,to,GRANULARITY)).toEqual(result)
        })
    })
})
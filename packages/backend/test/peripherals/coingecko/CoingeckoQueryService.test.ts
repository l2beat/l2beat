import { UnixTime } from "@l2beat/common";
import { expect } from "earljs";

import { CoingeckoQueryService, getFullTimestampsList } from "../../../src/peripherals/coingecko/CoingeckoQueryService";

describe(CoingeckoQueryService.name, () => {
})

describe(getFullTimestampsList.name, () => {
    describe("hourly", () => {
        const GRANULARITY = "hourly"
        const FROM = new UnixTime(1643806800) //Wed Feb 02 2022 13:00:00 GMT+0000
        const TO = new UnixTime(1643814000) //Wed Feb 02 2022 15:00:00 GMT+0000

        const RESULT = [new UnixTime(1643806800), new UnixTime(1643810400), new UnixTime(1643814000)]

        it("throws if FROM greater than TO", () => {
            expect(() => getFullTimestampsList(TO,FROM,GRANULARITY))
                .toThrow('FROM cannot be greater than TO')
        })

        it("works from 13:00 to 15:00", () => {
            expect(getFullTimestampsList(FROM,TO,GRANULARITY)).toEqual(RESULT)
        })

        it("works from 23:00 to 01:00", () => {
            const from = new UnixTime(1643842800) //Wed Feb 02 2022 23:00:00 GMT+0000
            const to = new UnixTime(1643850000) //Thu Feb 03 2022 01:00:00 GMT+0000
            const result = [new UnixTime(1643842800), new UnixTime(1643846400), new UnixTime(1643850000)]

            expect(getFullTimestampsList(from,to,GRANULARITY)).toEqual(result)
        })
    })
})
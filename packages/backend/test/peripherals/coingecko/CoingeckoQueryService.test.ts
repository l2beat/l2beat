import { UnixTime } from "@l2beat/common";
import { expect } from "earljs";

import { CoingeckoQueryService, getFullTimestampsList } from "../../../src/peripherals/coingecko/CoingeckoQueryService";

describe(CoingeckoQueryService.name, () => {
})

describe(getFullTimestampsList.name, () => {
    describe("hourly", () => {
        const GRANULARITY = "hourly"
        const FROM = UnixTime.fromDate(new Date('2021-09-07T13:00:00Z'))
        const TO = UnixTime.fromDate(new Date('2021-09-07T15:00:00Z'))

        const RESULT = [FROM, UnixTime.fromDate(new Date('2021-09-07T14:00:00Z')), TO]

        it("throws if FROM greater than TO", () => {
            expect(() => getFullTimestampsList(TO,FROM,GRANULARITY))
                .toThrow('FROM cannot be greater than TO')
        })

        it("13:00 to 15:00", () => {
            expect(getFullTimestampsList(FROM,TO,GRANULARITY)).toEqual(RESULT)
        })

        it("13:01 to 15:01", () => {
            expect(getFullTimestampsList(FROM.add(1,"minutes"),TO.add(1,"minutes"),GRANULARITY))
                .toEqual([...RESULT, UnixTime.fromDate(new Date('2021-09-07T16:00:00Z'))])
        })

        it("23:00 to 01:00", () => {
            const from = UnixTime.fromDate(new Date('2021-09-07T23:00:00Z'))
            const to = UnixTime.fromDate(new Date('2021-09-08T01:00:00Z'))
            const result = [from, UnixTime.fromDate(new Date('2021-09-08T00:00:00Z')), to]

            expect(getFullTimestampsList(from,to,GRANULARITY)).toEqual(result)
        })
    })

    describe("daily", () => {
        const GRANULARITY = "daily"
        const FROM = UnixTime.fromDate(new Date('2021-09-07T00:00:00Z'))
        const TO = UnixTime.fromDate(new Date('2021-09-09T00:00:00Z'))

        const RESULT = [FROM,UnixTime.fromDate(new Date('2021-09-08T00:00:00Z')),TO]

        it("throws if FROM greater than TO", () => {
            expect(() => getFullTimestampsList(TO,FROM,GRANULARITY))
                .toThrow('FROM cannot be greater than TO')
        })

        it("07.09.2021 00:00 to 09.09.2021 00:00", () => {
            expect(getFullTimestampsList(FROM,TO,GRANULARITY)).toEqual(RESULT)
        })

        it("07.09.2021 01:00 to 09.09.2021 01:00", () => {
            expect(getFullTimestampsList(FROM.add(1,'hours'),TO.add(1,"hours"),GRANULARITY))
            .toEqual([...RESULT, UnixTime.fromDate(new Date('2021-09-10T00:00:00Z'))])
        })
    })
})
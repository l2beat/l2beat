import { CoingeckoClient, UnixTime } from "@l2beat/common";

export enum Granularity {
    Hourly,
    Daily
}

export class CoingeckoQueryService {
    constructor(
       private coingeckoClient: CoingeckoClient
    ){}

}

export function generateTimestampsList(
    from: UnixTime,
    to: UnixTime,
    granularity: Granularity
): Date[] {
    if(granularity === Granularity.Hourly) {
        if(from.toNumber() % 3600 || to.toNumber() % 3600) return [] //maybe throw an error ?

        const result = []
    
        for(let i = from.toNumber(); i <= to.toNumber(); i += 3600) {
            result.push(new Date(i * 1000))
        }
    
        return result
    }
    return [] 
}


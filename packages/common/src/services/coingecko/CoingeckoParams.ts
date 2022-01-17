export interface MarketChartRangeParams {
    vs_currency: string
    from: string
    to: string
    }

export function CoingeckoMarketChartRangeParams(vs_currency: string, from: Date | number, to: Date | number) {
    if(!vs_currency || !from || !to ) throw new TypeError('Params cannot be empty')

    return {
        vs_currency: vs_currency.toLowerCase(),
        from: transfromDateToUnixTimestamp(from).toString(),
        to: transfromDateToUnixTimestamp(to).toString()
    }
}

export function transfromDateToUnixTimestamp(value: Date | number): number {
    if(typeof value === 'number') return value
    return +value
}


import {Injectable} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'

const ENDPOINT = 'https://poloniex.com/public'

export interface IItems {
    date: number,
    value: number,
}

@Injectable({
    providedIn: 'root',
})
export class CurrencyHistoryService {

    constructor(private httpClient: HttpClient) {
    }

    public getBtc(): Promise<IItems[]> {
        return new Promise(async (success) => {
            const params = new HttpParams({
                fromObject: {
                    command: 'returnChartData',
                    currencyPair: 'USDT_BTC',
                    start: String(this.getDateStart()),
                    end: String(this.getDateEnd()),
                    period: String(86400),
                },
            })

            this.httpClient
                .request('GET', ENDPOINT, {responseType: 'json', params})
                .subscribe((response: any) => {
                    const result: IItems[] = []

                    response.forEach((row) => {
                        result.push({
                            date: row.date,
                            value: row.weightedAverage,
                        })
                    })

                    return success(result)
                })
        })
    }

    public getEos(): Promise<IItems[]> {
        return new Promise(async (success) => {
            const params = new HttpParams({
                fromObject: {
                    command: 'returnChartData',
                    currencyPair: 'USDT_EOS',
                    start: String(this.getDateStart()),
                    end: String(this.getDateEnd()),
                    period: String(86400),
                },
            })

            this.httpClient
                .request('GET', ENDPOINT, {responseType: 'json', params})
                .subscribe((response: any) => {
                    const result: IItems[] = []

                    response.forEach((row) => {
                        result.push({
                            date: row.date,
                            value: row.weightedAverage,
                        })
                    })

                    return success(result)
                })
        })
    }

    public getEth(): Promise<IItems[]> {
        return new Promise(async (success) => {
            const params = new HttpParams({
                fromObject: {
                    command: 'returnChartData',
                    currencyPair: 'USDT_ETH',
                    start: String(this.getDateStart()),
                    end: String(this.getDateEnd()),
                    period: String(86400),
                },
            })

            this.httpClient
                .request('GET', ENDPOINT, {responseType: 'json', params})
                .subscribe((response: any) => {
                    const result: IItems[] = []

                    response.forEach((row) => {
                        result.push({
                            date: row.date,
                            value: row.weightedAverage,
                        })
                    })

                    return success(result)
                })
        })
    }

    private getDateStart(): number {
        return parseInt(String(((new Date).getTime() / 1000 - (86400 * 30))), 0)
    }

    private getDateEnd(): number {
        return parseInt(String(Math.floor((new Date).getTime()) / 1000), 0)
    }
}

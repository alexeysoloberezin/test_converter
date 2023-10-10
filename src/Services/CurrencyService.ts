import axios, {AxiosInstance} from "axios";
import {Currency} from "../types/CurrencyConvertor/CurrencyConvertorTypes";

class CurrencyService {
  private _api: AxiosInstance = axios.create({baseURL: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/'})
  private currencyList: Currency[] | null = null
  private activeCourse: number | null = null
  private activeCurrency: string | null = null

  getCurrencyList(): Currency[] | null {
    return this.currencyList
  }

  getActiveCourse(value: number): number {
    return this.activeCourse * value
  }

  async fetchCurrencyList(): Promise<void> {
    try {
      const res = await this._api.get('/latest/currencies.json')

      if(res.status === 200){
        const keys = Object.keys(res.data)
        this.currencyList = keys.map(key => ({
          name: res.data[key],
          code: key
        }))
        return Promise.resolve()
      }
      return Promise.reject()
    }catch (err){
      return Promise.reject(err)
    }
  }

  async fetchCurrencyItem(currency: Currency | null): Promise<void> {
    if(!currency) return Promise.reject()
    try {
      const res = await this._api.get(`latest/currencies/${currency.code}.json`)

      if(res.status === 200){
        this.activeCourse = +res.data[currency.code]?.rub
        return Promise.resolve()
      }

      return Promise.reject()
    }catch (err){
      return Promise.reject(err)
    }
  }

  saveCurrency(currency: Currency | null): void {
    if(currency){
      localStorage.setItem('currencyCode', JSON.stringify(currency))
      this.activeCurrency = currency.code
    }
  }

  restoreCurrency(): Currency | null {
    const currencyJson: string | undefined = localStorage.getItem('currencyCode')

    if(currencyJson){
      const currency: Currency = JSON.parse(currencyJson)
      this.activeCurrency = currency.code
      return currency
    }
    return null
  }
}

export default CurrencyService;
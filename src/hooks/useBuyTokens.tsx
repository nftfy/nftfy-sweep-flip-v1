import { NetworksId } from '@appTypes/config/Network'
import { paths } from '@reservoir0x/reservoir-kit-client'
import { useState } from 'react'

const RESERVOIR_API_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY
const BASE_API_URL = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE
const BUY_TOKENS_API_PATH = '/execute/buy/v6'

// type BodyParams = paths['/execute/buy/v6']['post']['parameters']['body']['body']
type Response = paths['/execute/buy/v6']['post']['responses']['200']['schema']

export const useBuyTokens = (chainId: number) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<any | undefined>(undefined)

  async function requestBuyTokens (account: string, tokens: any[]) {
    setLoading(true)
    setErrors(undefined)

    if(tokens.length < 1 || !account) {
      setLoading(false)
      return
    }

    const options: RequestInit | undefined = {}

    options.method = 'POST'

    options.headers = {
      accept: '*/*',
      'content-type': 'application/json',
      'x-api-key': chainId === NetworksId.ethereum && RESERVOIR_API_KEY ? RESERVOIR_API_KEY : 'demo-api-key',
    }
    
    options.body = JSON.stringify({
      tokens: tokens,
      onlyPath: false,
      currency: '0x0000000000000000000000000000000000000000',
      partial: false,
      skipErrors: false,
      skipBalanceCheck: false,
      taker: account
    })

    try {
      const url = new URL(BASE_API_URL + BUY_TOKENS_API_PATH)

      const request = await fetch(url, options)
      const response = request.json() as Response

      console.log(response) //rm

      setLoading(false)
    } catch(err) {
      setErrors(err)

      console.log(err) //rm

      setLoading(false)
    }


  }

  return {requestBuyTokens, errors, loading}

}

import { NetworksId } from '@appTypes/config/Network'
import { paths } from '@reservoir0x/reservoir-kit-client'
import { useState } from 'react'

const RESERVOIR_API_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY
const BASE_API_URL = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE
const TOKENS_API_PATH = '/tokens/v5'

type Schema = paths['/tokens/v5']['get']['responses']['200']['schema']
export type Tokens = paths['/tokens/v5']['get']['responses']['200']['schema']['tokens']
type Query = paths['/tokens/v5']['get']['parameters']['query']

export const useTokens = (chainId: number) => {
  const [tokens, setTokens] = useState<Tokens>(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  async function fetchTokens ( id?: string) {
    setLoading(true)

    const options: RequestInit | undefined = {}

    if (chainId === NetworksId.ethereum && RESERVOIR_API_KEY) {
      options.headers = {
        'x-api-key': RESERVOIR_API_KEY,
      }
    }

     let query: Query = {
      limit: 20,
      sortBy: 'floorAskPrice',
      collection: id
    }


    const url = new URL(BASE_API_URL + TOKENS_API_PATH)
    const href = setParams(url, query)

    const res = await fetch(href, options)
    const data = (await res.json()) as Schema
    setTokens(data.tokens)

    setLoading(false)
  }

  return {fetchTokens , tokens, loading}

}
function setParams(url: string | URL, query: { [x: string]: any }) {
  if (typeof url === 'string') {
    const searchParams = new URLSearchParams(query)
    return `${url}?${searchParams.toString()}`
  }
  Object.keys(query).map((key) =>
    url.searchParams.set(key, query[key]?.toString())
  )
  return url.href
}

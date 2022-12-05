import { NetworksId } from '@appTypes/config/Network'
import { paths } from '@reservoir0x/reservoir-kit-client'
import { useState } from 'react'

const RESERVOIR_API_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY
const BASE_API_URL = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE
const COLLECTIONS_API_PATH = 'collections/v5'

type Schema = paths['/collections/v5']['get']['responses']['200']['schema']
type Collections = paths['/collections/v5']['get']['responses']['200']['schema']['collections']
type Query = paths['/collections/v5']['get']['parameters']['query']

export const useCollections = (chainId: number) => {
  const [collections, setCollections] = useState<Collections>(undefined)
  const [continuation, setContinuation] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  async function fetchCollections (nextPage: boolean, id?: string, name?:string) {
    setLoading(true)

    const options: RequestInit | undefined = {}

    if (chainId === NetworksId.ethereum && RESERVOIR_API_KEY) {
      options.headers = {
        'x-api-key': RESERVOIR_API_KEY,
      }
    }

    let query: Query = {
      limit: 10,
      sortBy: '7DayVolume',
    }

    if (id) query.id = id
    if (name) query.name = name
    if (nextPage) query.continuation = continuation

    const url = new URL(BASE_API_URL + COLLECTIONS_API_PATH)
    const href = setParams(url, query)
    
    const res = await fetch(href, options)
    const data = (await res.json()) as Schema

    if(!nextPage) {
      setCollections(data.collections)
    } else {
      const newCollections = collections?.concat(data.collections ?? [])
      setCollections(newCollections)
    }

    if(data.continuation) {
      setContinuation(data.continuation)
      setHasMore(true)
    } else {
      setContinuation(undefined)
      setHasMore(false)
    }

    setLoading(false)
  }

  return {fetchCollections, collections, hasMore, loading}

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

import { paths } from '@reservoir0x/reservoir-kit-client'
import { useState } from 'react'

const RESERVOIR_API_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY

type Collections = paths['/collections/v5']['get']['responses']['200']['schema']
type Query = paths['/collections/v5']['get']['parameters']['query']

export const useCollections = (chainId: number) => {
  const [data, setData] = useState<any>()
  const [collections, setCollections] = useState<any>()
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const url = new URL('https://api.reservoir.tools/collections/v5')

  async function fetchCollections (id?: string, name?:string) {
    console.log('start')
    setLoading(true)

    const options: RequestInit | undefined = {}

    if (RESERVOIR_API_KEY) {
      options.headers = {
        'x-api-key': RESERVOIR_API_KEY,
      }
    }

    let query: Query = {
      limit: 20,
      sortBy: '7DayVolume',
    }

    if (id) query.id = id
    if (name) query.name = name

    console.log(query, 'query')

    const href = setParams(url, query)

    console.log(href, 'href')
  
    const res = await fetch(href, options)

    console.log(res, 'res')

    const data = (await res.json()) as Collections

    console.log(data, 'data')

    setData(data)
    setCollections(data.collections)

    if(data.continuation) {
      setHasMore(true)
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

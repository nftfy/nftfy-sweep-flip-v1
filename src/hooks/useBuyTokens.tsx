import { Execute, paths } from '@reservoir0x/reservoir-kit-client'
import { useReservoirClient, } from '@reservoir0x/reservoir-kit-ui'
// import { Signer } from 'ethers'
import { useState } from 'react'
import { useSigner } from 'wagmi'

type Tokens = paths['/tokens/v5']['get']['responses']['200']['schema']['tokens']

export const useBuyTokens = (chainId: number) => {
  const reservoirClient = useReservoirClient()
  const { data: signer } = useSigner()
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<any | undefined>(undefined)
  const [steps, setSteps] = useState<Execute['steps'] | undefined>(undefined)

  async function execute (tokens: Tokens, sweepTotal: string) {
    try {
      setLoading(true)
      setErrors(undefined)

      if (!reservoirClient) {
        setLoading(false)
        throw 'Client is not initialized'
      }

      if (!signer) {
        setLoading(false)
        throw 'Missing a signer'
      }

      if (!tokens) {
        setLoading(false)
        throw 'Missing tokens to sweep'
      }

      let sweepTokens: any[] = []

      for (let item of tokens) {
        sweepTokens.push({
          tokenId: item.token?.tokenId,
          contract: item.token?.contract,
        })
      }

      console.log(sweepTokens)

      const sweep = await reservoirClient.actions.buyToken({
        expectedPrice: Number(sweepTotal),
        tokens: sweepTokens,
        signer,
        onProgress: setSteps,
        options: {
          partial: false,
        }
      })

      console.log(sweep) //rm

      setLoading(false)
    } catch(err) {
      setErrors(err)

      console.log(err) //rm

      setLoading(false)
    }

  }

  return {execute, errors, loading}

}

import { Execute, paths } from '@reservoir0x/reservoir-kit-client'
import { useReservoirClient, } from '@reservoir0x/reservoir-kit-ui'
// import { Signer } from 'ethers'
import { useState } from 'react'
import { useSigner } from 'wagmi'

type Tokens = paths['/tokens/v5']['get']['responses']['200']['schema']['tokens']

const mockTokens = [
  {
    tokenId: '307',
    contract: '0x46bEF163D6C470a4774f9585F3500Ae3b642e751'
  },
  {
    tokenId: '305',
    contract: '0x46bEF163D6C470a4774f9585F3500Ae3b642e751'
  },
]

export const useBuyTokens = (chainId: number) => {
  const reservoirClient = useReservoirClient()
  const { data: signer } = useSigner()
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<any | undefined>(undefined)
  const [steps, setSteps] = useState<Execute['steps'] | undefined>(undefined)

  async function execute (/*tokens: Tokens*/) {
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

      // if (!tokens) {
      //   setLoading(false)
      //   throw 'Missing tokens to sweep'
      // }

      // let sweepTokens: any[] = []

      // for (let item of tokens) {
      //   sweepTokens.push({
      //     tokenId: item.token?.tokenId,
      //     contract: item.token?.contract,
      //   })
      // }

      console.log(mockTokens, 'swepTokens') //rm

      const sweep = await reservoirClient.actions.buyToken({
        // expectedPrice: Number(sweepTotal),
        tokens: mockTokens,//change
        signer,
        onProgress: setSteps,
        options: {
          partial: false,
        }
      })

      console.log(sweep, 'sweep actions') //rm

      setLoading(false)
    } catch(err) {
      setErrors(err)

      console.log(err) //rm

      setLoading(false)
    }

  }

  return {execute, steps, errors, loading}

}

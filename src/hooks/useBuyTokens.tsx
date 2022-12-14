import { setToast } from '@components/shared/setToast'
import { Execute, paths } from '@reservoir0x/reservoir-kit-client'
import { useReservoirClient, } from '@reservoir0x/reservoir-kit-ui'
import { useState } from 'react'
import message from 'src/message'
import { useSigner } from 'wagmi'

type Tokens = paths['/tokens/v5']['get']['responses']['200']['schema']['tokens']

export const useBuyTokens = () => {
  const reservoirClient = useReservoirClient()
  const { data: signer } = useSigner()
  const [loading, setLoading] = useState<boolean>(false)
  const [steps, setSteps] = useState<any | undefined>(undefined)
  const [errors, setErrors] = useState<any | undefined>(undefined)
  const [transaction, setTransaction] = useState<any | undefined>(undefined)

  async function execute (tokens: Tokens) {
    try {
      setLoading(true)
      setErrors(undefined)

      if (!reservoirClient) {
        setLoading(false)
        throw message['1001']
      }

      if (!signer) {
        setLoading(false)
        throw message['1002']
      }

      if (!tokens) {
        setLoading(false)
        throw message['1003']
      }

      let sweepTokens: any[] = []

      for (let item of tokens) {
        sweepTokens.push({
          tokenId: item.token?.tokenId,
          contract: item.token?.contract,
        })
      }

      await reservoirClient.actions.buyToken({
        tokens: sweepTokens,
        signer,
        onProgress: (steps: Execute["steps"]) => {
          if (!steps) {
            return
          }
          setSteps(steps)
        },
        options: {
          partial: false,
        }
      })
      .then(result => setTransaction(result))
      .catch((err) => {
        setLoading(false)
        if (err?.type === 'price mismatch') {
          setToast({
            message: 'Price was greater than expected.',
            title: 'Could not buy token',
          })
          return
        }

        if (err?.message.includes('ETH balance')) {
          setToast({
            message: 'You have insufficient funds to buy this token.',
            title: 'Not enough ETH balance',
          })
          return
        }

        if (err?.code === 4001) {
          setSteps(undefined)
          setToast({
            message: 'You have canceled the transaction.',
            title: 'User canceled transaction',
          })
          return
        }
        setToast({
          message: 'The transaction was not completed.',
          title: 'Could not buy tokens',
        })
      })

      setLoading(false)
    } catch(error) {
      setErrors(error)
      setLoading(false)
    }

  }

  return {execute, steps, transaction, errors, loading}

}

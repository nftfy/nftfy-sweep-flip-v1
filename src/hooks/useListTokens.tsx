import { setToast } from "@components/shared/setToast";
import { definitions, Execute } from "@reservoir0x/reservoir-kit-client";
import { useReservoirClient } from "@reservoir0x/reservoir-kit-ui";
import { useState } from "react";
import message from "src/message";
import { useSigner } from "wagmi";

type SupportedMarketplaces = 'opensea' | 'x2y2' | 'looks-rare'
type Listing = definitions["Model300"]

const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

interface Fee {
  address: string
  basisPoint: string
}

interface ExecuteListTokensProps {
  token: string
  weiPrice: string
  expirationTime: string
  fees: Fee[]
  currencyAddress: string
  requiresChecking: boolean
  marketplaces: SupportedMarketplaces[]
}

export const useListTokens = () => {
  const reservoirClient = useReservoirClient()
  const { data: signer } = useSigner()
  const [loading, setLoading] = useState<boolean>(false)
  const [steps, setSteps] = useState<any | undefined>(undefined)
  const [errors, setErrors] = useState<any | undefined>(undefined)
  const [transaction, setTransaction] = useState<any | undefined>(undefined)

  async function execute ({ weiPrice, token, expirationTime, fees, requiresChecking, marketplaces, currencyAddress = ETH_ADDRESS }: ExecuteListTokensProps) {
    try {
      setLoading(true)
      setErrors(undefined)

      if (!reservoirClient) {
        setLoading(false)
        throw new Error(message['1001'])
      }

      if (!signer) {
        setLoading(false)
        throw new Error(message['1002'])
      }

      const listings: Listing[] = marketplaces.map((marketplace: SupportedMarketplaces): Listing => {
        return {
          token,
          weiPrice,
          orderbook: marketplace,
          orderKind: marketplace === 'opensea' ? 'seaport' : marketplace,
          fees: fees.map(({ address, basisPoint }) => `${address}:${basisPoint}`),
          expirationTime,
          currency: currencyAddress
        }
      })

      await reservoirClient.actions.listToken({
        listings,
        signer,
        onProgress: (steps: Execute["steps"]) => {
          if (!steps) {
            return
          }
          setSteps(steps)
        },
        precheck: requiresChecking
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

  return { execute, steps, transaction, errors, loading }

}

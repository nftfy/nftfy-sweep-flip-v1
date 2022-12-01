export interface ReservoirCollection {
  id?: string,
  slug?: string,
  createdAt?: string,
  name?: string,
  image?: string,
  banner?: string,
  discordUrl?: string,
  externalUrl?: string,
  twitterUsername?: string,
  openseaVerificationStatus?: string,
  description?: string,
  sampleImages?: string[],
  tokenCount?: string,
  onSaleCount?: string,
  primaryContract?: string,
  tokenSetId?: string,
  royalties?: {
    bps?: number,
    recipient?: string
  },
  lastBuy?: {
    value?: number
  },
  floorAsk?: {
    id?: string,
    sourceDomain?: string,
    price?: {
      currency?: {
        contract?: string,
        name?: string,
        symbol?: string,
        decimals?: number
      },
      amount?: {
        raw?: string,
        decimal?: number,
        usd?: number,
        native?: number
      }
    },
    maker?: string,
    validFrom?: number,
    validUntil?: number,
    token?: {
      contract?: string,
      tokenId?: string,
      name?: string,
      image?: string
    }
  },
  collectionBidSupported?: boolean
}
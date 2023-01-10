import { makeVar } from '@apollo/client'

export const sweepRulesSettingsVar = makeVar<string[]>([])
export const listingMarketplacesVar = makeVar<string[]>(['opensea'])

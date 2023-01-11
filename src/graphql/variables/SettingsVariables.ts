import { makeVar } from '@apollo/client'

export const sweepRulesSettingsVar = makeVar<string[]>(['skipPending', 'skipSuspicious'])
export const listingMarketplacesVar = makeVar<string[]>(['opensea'])

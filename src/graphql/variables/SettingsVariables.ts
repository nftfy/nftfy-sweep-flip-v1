import { makeVar } from '@apollo/client'

export const sweepRulesSettingsVar = makeVar<string[]>(['skipPeding', 'skipSuspicious'])
export const listingMarketplacesVar = makeVar<string[]>(['opensea'])

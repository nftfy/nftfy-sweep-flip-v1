import { makeVar } from '@apollo/client'

export const transactionProcessingVar = makeVar<boolean>(false)
export const preparingTransactionVar = makeVar<boolean>(false)
export const transactionLoadingVar = makeVar<boolean>(false)

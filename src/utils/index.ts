export const OPENSEA_FEE = 0.025

export const calculateProfit = (amountToBuy: number, profit: number) => {
  return (amountToBuy * OPENSEA_FEE) - (profit / 100)
}

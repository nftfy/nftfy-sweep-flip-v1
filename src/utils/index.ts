export const OPENSEA_FEE = 0.025

export const calculateProfit = (amountToBuy: number, profit: number) => {
  console.log('amountToBuy', amountToBuy)
    console.log('profit', profit)
  return amountToBuy * (profit / 100)
}

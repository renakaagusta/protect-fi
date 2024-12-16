import { formatUnits } from "viem"

export const formatTokenAmount = (amount: number, decimals = 18, displayDecimals = 2) => {
    if (!amount) return '0'
    
    const formatted = formatUnits(BigInt(amount), decimals)
    const number = Number(formatted)
    
    if (number < 0.01) {
      return '< 0.01'
    }
    
    return number.toLocaleString(undefined, {
      minimumFractionDigits: displayDecimals,
      maximumFractionDigits: displayDecimals
    })
  }
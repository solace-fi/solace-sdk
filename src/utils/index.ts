import { getProvider, getSigner } from './ethers';
import { getGasPrice, getGasSettings } from './gas';

export * from './price'
export * from './contract'
export * from './api'

export const solaceUtils = {
  getProvider,
  getSigner,
  getGasPrice,
  getGasSettings
}


export const withBackoffRetries = async (f: any, retryCount = 3, jitter = 250) => {
  let nextWaitTime = 1000
  let i = 0
  while (true) {
    try {
      return await f()
    } catch (error) {
      i++
      if (i >= retryCount) {
        throw error
      }
      await delay(nextWaitTime + Math.floor(Math.random() * jitter))
      nextWaitTime =
        nextWaitTime === 0 ? 1000 : Math.min(10000, 2 * nextWaitTime)
    }
  }
}

export const delay = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const rangeFrom0 = (stop: number): number[] => {
  const arr = []
  for (let i = 0; i < stop; ++i) {
    arr.push(i)
  }
  return arr
}
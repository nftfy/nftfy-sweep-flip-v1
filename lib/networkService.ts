import { NetworksId, NetworksName } from '../config/Network'

export const networkIdByName = (network: string) => {
  switch (network) {
    case NetworksName.ethereum:
      return NetworksId.ethereum
    case NetworksName.goerli:
      return NetworksId.goerli
    case NetworksName.mumbai:
      return NetworksId.mumbai
    default:
      return ''
  }
}

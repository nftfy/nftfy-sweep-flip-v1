import { FC, useContext } from 'react'
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'
import { Button } from 'antd'
import FormatEth from './FormatEth'
import { GlobalContext } from 'context/GlobalState'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useMounted from 'hooks/useMounted'
import Avatar from './Avatar'
import { truncateAddress, truncateEns } from 'lib/truncateText'

const ConnectWallet: FC = () => {
  const account = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })
  const { disconnect } = useDisconnect()
  const { dispatch } = useContext(GlobalContext)
  const isMounted = useMounted()

  if (!isMounted) {
    return null
  }

  if (!account.isConnected) return <ConnectWalletButton />

  return (
    <>
      <Avatar address={account.address} avatar={ensAvatar} size={32}/>
      <Button
        type="primary"
        onClick={() => {
          dispatch({ type: 'CONNECT_WALLET', payload: false })
          disconnect()
        }}
      >
        {ensName ? (
            <span>{truncateEns(ensName)}</span>
          ) : (
            <span>{truncateAddress(account.address || '')}</span>
          )}
      </Button>
    </>
  )
}

export default ConnectWallet

type Props = {
  address: string
}

export const Balance: FC<Props> = ({ address }) => {
  const { data: balance } = useBalance({ addressOrName: address })
  return <FormatEth amount={balance?.value} />
}

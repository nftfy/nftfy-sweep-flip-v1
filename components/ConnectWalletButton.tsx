import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC } from 'react'
import { useAccount } from 'wagmi'
import { Button } from 'antd'

type Props = {
  className?: HTMLButtonElement['className']
}

const ConnectWalletButton: FC<Props> = ({ className }) => {
  const account = useAccount()
  return (
    <ConnectButton.Custom>
      {({ openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading'

        return (
          <div
            {...((!ready || account.isConnected) && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
                display: 'none'
              }
            })}
          >
            {(() => {
              return (
                <Button
                  onClick={openConnectModal}
                  type="primary"
                >
                  Connect Wallet
                </Button>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default ConnectWalletButton

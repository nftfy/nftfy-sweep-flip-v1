import { FC } from 'react'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import { Divider as AntDivider, Layout as LayoutAntd } from 'antd'
import Navbar from './Navbar'
import styled from 'styled-components'
import NetworkWarning from './NetworkWarning'
import { Footer } from './Footer'

const { Content } = LayoutAntd

interface LayoutProps {
  chainId: number
}

const Layout: FC<LayoutProps> = ({ chainId, children }) => {
  return (
    <>
      <Head>
        <title>Sweep and Flip</title>
        <meta property='title' content='Sweep and Flip' />
        <meta name='description' content='app.seewp-flip.nftfy.org is a decentralized protocol where you can own rewards staking tokens.' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://app.seewp-flip.nftfy.org/' />
        <meta property='og:title' content='Nftfy - Sweep and Flip' />
        <meta
          property='og:description'
          content='app.seewp-flip.nftfy.org is a decentralized protocol where you can own rewards staking tokens.'
        />
        <meta property='og:image' content='https://nftfy.org/nftfy.jpg' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:url' content='https://nftfy.org/' />
        <meta name='twitter:title' content='Nftfy - Sweep and flip' />
        <meta
          name='twitter:description'
          content='app.seewp-flip.nftfy.org is a decentralized protocol where you can own rewards staking tokens.'
        />
        <meta name='twitter:image' content='https://nftfy.org/nftfy.jpg' />
      </Head>
      <Toaster
        position={'top-right'}
        containerStyle={{ zIndex: 100000000000 }}
      />
      <NetworkWarning />
      <LayoutAntd>
        <Navbar />
        <Divider />
        <Body>
          <Main>
            {children}
          </Main>
        </Body>
        <Footer />
      </LayoutAntd>
    </>
  )
}

const { Main, Divider, Body } = {
  Body: styled.div`
    background: #FAFAFA;
  `,
  Main: styled(Content)`
    padding: 16px 24px;
    min-height: calc(100vh - 128px);
    max-width: calc(var(--screen-xl) - 48px);
    margin: 0 auto;
    width: 100%;
  `,
  Divider: styled(AntDivider)`
    margin: 0;
  `
}

export default Layout

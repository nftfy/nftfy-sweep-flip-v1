import { Col, Image, Layout, Row, Typography } from 'antd'
import styled from 'styled-components'

const { Footer: AntFooter } = Layout
const { Text } = Typography

export function Footer() {
  return (
    <FooterContainer>
      <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Col>
          <Text type='secondary'>Made by NFTfy</Text>
        </Col>
        <Col style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LinkButton href='https://bit.ly/3xdGR4k' target='_blank'>
            <Image src='/icons/discord.svg' alt='discord' width={16} height={16} preview={false} />
          </LinkButton>
          <LinkButton href='https://twitter.com/nftfyofficial' target='_blank'>
            <Image src='/icons/twitter.svg' alt='twitter' width={16} height={16} preview={false} />
          </LinkButton>
          <LinkButton href='https://www.linkedin.com/company/nftfy/' target='_blank'>
            <Image src='/icons/linkedin.svg' alt='linkedIn' width={16} height={16} preview={false} />
          </LinkButton>
        </Col>
      </Row>
    </FooterContainer>
  )
}

const { FooterContainer, LinkButton } = {
  FooterContainer: styled(AntFooter)`
    border-top: 1px solid var(--gray-4);
  `,
  LinkButton: styled.a`
    cursor: pointer;
  `
}

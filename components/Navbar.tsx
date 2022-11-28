import { useMediaQuery } from '@react-hookz/web'
import { paths } from '@reservoir0x/reservoir-kit-client'
import NavbarLogo from 'components/navbar/NavbarLogo'
import useMounted from 'hooks/useMounted'
import setParams from 'lib/params'
import dynamic from 'next/dynamic'
import { FC, ReactElement, useEffect, useState } from 'react'
import { Col, Image, Layout, Menu, MenuProps, Row, Space, Typography } from 'antd'
import CartMenu from './CartMenu'
import ConnectWallet from './ConnectWallet'
import HamburgerMenu from './HamburgerMenu'
import ListItemButton from './navbar/ListItemButton'
import SearchMenu from './SearchMenu'
import ThemeSwitcher from './ThemeSwitcher'

const SearchCollections = dynamic(() => import('./SearchCollections'))
const CommunityDropdown = dynamic(() => import('./CommunityDropdown'))
const EXTERNAL_LINKS = process.env.NEXT_PUBLIC_EXTERNAL_LINKS || null
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID
const DEFAULT_TO_SEARCH = process.env.NEXT_PUBLIC_DEFAULT_TO_SEARCH
const THEME_SWITCHING_ENABLED = process.env.NEXT_PUBLIC_THEME_SWITCHING_ENABLED

function getInitialSearchHref() {
  const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE
  const pathname = `${PROXY_API_BASE}/search/collections/v1`
  const query: paths['/search/collections/v1']['get']['parameters']['query'] = {}

  if (COLLECTION_SET_ID) {
    query.collectionsSetId = COLLECTION_SET_ID
  } else {
    if (COMMUNITY) query.community = COMMUNITY
  }

  return setParams(pathname, query)
}

const { Header: NavbarAntd } = Layout

const Navbar: FC = () => {
  const isMounted = useMounted()
  const [showLinks, setShowLinks] = useState(true)
  const [filterComponent, setFilterComponent] = useState<ReactElement | null>(null)
  const isMobile = useMediaQuery('(max-width: 770px)')
  const showDesktopSearch = useMediaQuery('(min-width: 1200px)')
  const [hasCommunityDropdown, setHasCommunityDropdown] = useState<boolean>(false)

  const externalLinks: { name: string; url: string }[] = []

  if (typeof EXTERNAL_LINKS === 'string') {
    const linksArray = EXTERNAL_LINKS.split(',')

    linksArray.forEach(link => {
      let values = link.split('::')
      externalLinks.push({
        name: values[0],
        url: values[1]
      })
    })
  }

  const isGlobal = !COMMUNITY && !COLLECTION && !COLLECTION_SET_ID
  const themeSwitcherEnabled = THEME_SWITCHING_ENABLED

  useEffect(() => {
    setShowLinks(externalLinks.length > 0)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <NavbarAntd>
      <Row align='middle'>
        <Col style={{ display: 'flex', justifyItems: 'baseline' }} span={8}>
          <NavbarLogo/>
        </Col>
        <Col style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: '8px' }} span={16}>
          <ConnectWallet />
          <ThemeSwitcher />
        </Col>
      </Row>
    </NavbarAntd>
  )
}

export default Navbar

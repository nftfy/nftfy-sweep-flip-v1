import Link from 'next/link'
import { FC } from 'react'
import { Image, Space, Typography } from 'antd'

const DESKTOP_NAVBAR_LOGO = process.env.NEXT_PUBLIC_DESKTOP_NAVBAR_LOGO

const NavbarLogo: FC = () => {
  const logo = DESKTOP_NAVBAR_LOGO || '/reservoir-desktop.svg'

  return (
    <Link href='/'>
      <Space align='center' wrap size={14} style={{ top: '2px'}}>
        <Image preview={false} height={32} src={logo} alt='logo' />
      </Space>
    </Link>
  )
}

export default NavbarLogo

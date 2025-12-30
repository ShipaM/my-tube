'use client'

import Link from 'next/link'
import { libraryItems, mainNavItems } from './constants'
import { useMyChannels } from '@/modules/chanels/hooks/use-channels'
import { Avatar } from '../../ui/avatar'
import { HiCog } from 'react-icons/hi'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

type SidebarProps = {
  iscollapsed: boolean
}
export const Sidebar: React.FC<SidebarProps> = ({ iscollapsed }) => {
  const pathname = usePathname()
  const { data: channels } = useMyChannels()
  return (
    <aside className={clsx('sidebar', { 'sidebar--collapsed': iscollapsed })}>
      <div className="sidebar__content">
        <nav className="sidebar__section">
          <div className="sidebar__nav">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={clsx('sidebar__item', { 'sidebar__item--active': isActive })}
                >
                  <Icon className="sidebar__item-icon" />
                  <span className="sidebar__item-text">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <nav className="sidebar__section">
          <h3 className="sidebar__section-title">Library</h3>
          <div className="sidebar__nav">
            {libraryItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx('sidebar__item', { 'sidebar__item--active': isActive })}
                >
                  <Icon className="sidebar__item-icon" />
                  <span className="sidebar__item-text">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
        {channels.length && (
          <nav className="sidebar__section">
            <div className="sidebar__divider">
              <span className="sidebar__divider-text">Subscriptions</span>
            </div>
            <div className="sidebar__nav">
              {channels.slice(0, 5).map((channel, ind) => {
                const isActive = pathname === `/channel/${channel.handle}`
                return (
                  <Link
                    key={channel.id}
                    href={`/channel/${channel.handle}`}
                    className={clsx('sidebar__subscription', {
                      'sidebar__subscription--active': isActive,
                    })} //"sidebar__subscription"
                  >
                    <Avatar
                      src={`https://i.pravatar.cc/36?img=${ind + 1}`}
                      alt={channel.owner.name || channel.handle}
                      size="xs"
                    />

                    <span className="sidebar__subscription-name">
                      {channel.owner.name || channel.handle}
                    </span>
                  </Link>
                )
              })}
            </div>
          </nav>
        )}

        <nav className="sidebar__section">
          <div className="sidebar__nav">
            <Link
              href="/studio/settings"
              className={clsx('sidebar__item', {
                'sidebar__item--active': pathname === '/studio/settings',
              })}
            >
              <HiCog className="sidebar__item-icon" />
              <span className="sidebar__item-text">Settings</span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  )
}

'use client'
import Link from 'next/link'
import { FaPlay } from 'react-icons/fa'
import { HiBell, HiMenu, HiPlus, HiSearch } from 'react-icons/hi'
import { Avatar } from '../../ui/avatar'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <button className="header__menu-btn" onClick={onMenuClick}>
            <HiMenu />
          </button>

          <Link href="/" className="header__logo">
            <FaPlay className="header__logo-icon" />
            <span className="header__logo-text">NextTube</span>
          </Link>
        </div>
        <div className="header__center">
          <form className="search-field">
            <HiSearch className="search-field__icon" />
            <input
              type="text"
              className="search-field__input"
              placeholder="Search videos, channels, and more"
            />
          </form>
        </div>
        <div className="header__right">
          <Link href="/studio" className="header__action">
            <HiPlus />
          </Link>
          <button className="header__action">
            <HiBell />
          </button>

          <div className="dropdown" ref={dropdownRef}>
            <button className="header__profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Avatar size="sm" src="/avatar.jpg" />
            </button>

            <div
              className={clsx('dropdown__content', { 'dropdown__content--open': isDropdownOpen })}
            >
              <div className="dropdown__header">
                <Avatar src="https://i.pravatar.cc/36?img=3" alt="User" size="lg" />
                <div className="dropdown__header-info">
                  <div>User Name</div>
                  <div className="dropdown__header-username">@username</div>
                </div>
              </div>
              <div className="dropdown__body">
                <Link
                  href="/channel/username"
                  className="dropdown__item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Your channel
                </Link>
                <Link
                  href="/studio/dashboard"
                  className="dropdown__item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Studio
                </Link>
                <Link
                  href="/studio/settings"
                  className="dropdown__item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Settings
                </Link>
                <div className="dropdown__divider" />
                <button
                  className="dropdown__item dropdown__item--danger"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    // TODO: Implement logout
                    console.log('Logout')
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

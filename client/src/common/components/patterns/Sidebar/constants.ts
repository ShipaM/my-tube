import { HiClock, HiCollection, HiHeart, HiHome } from 'react-icons/hi'

export const mainNavItems = [
  {
    icon: HiHome,
    href: '/',
    label: 'Home',
  },
  {
    label: 'Subscriptions',
    href: '/subscriptions',
    icon: HiCollection,
    auth: true,
  },
]

export const libraryItems = [
  {
    icon: HiClock,
    href: '/history',
    label: 'History',
    auth: true,
  },
  {
    icon: HiHeart,
    href: '/liked',
    label: 'Liked videos',
    auth: true,
  },
]

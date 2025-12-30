export type VideoListResponse = {
  videos: Video[]
  pagination: Pagination
}

export type Video = {
  id: string
  publicId: string
  title: string
  description: string
  thumbnailPath: string
  videoFileName: string
  maxQuality: VideoQuality
  views: number
  isPublished: boolean
  channelId: string
  publishedAt: string // ISO date
  createdAt: string // ISO date
  updatedAt: string // ISO date
  channel: Channel
  _count: VideoCount
  availableQualities: VideoQuality[]
}

export type Channel = {
  id: string
  handle: string
  bio: string
  avatarPath: string
  bannerPath: string
  ownerId: string
  createdAt: string // ISO date
  updatedAt: string // ISO date
  owner: ChannelOwner
}

export type ChannelOwner = {
  id: string
  name: string
}

export type VideoCount = {
  likes: number
  comments: number
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * You can keep this as string if qualities are fully dynamic,
 * but union gives you better safety & autocomplete.
 */
export type VideoQuality = '480p' | '720p' | '1080p' | '2k' | '4k'

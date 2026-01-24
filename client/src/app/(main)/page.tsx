'use client'
import { Video } from '@/modules/chanels/types/channels.types'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomePage() {
  // const [videos, setVideos] = useState([])
  // console.log(videos)
  // useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
  //     .then((res) => res.json())
  //     .then((data) => setVideos(data.videos))
  // }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
      return res.json()
    },
  })

  const videos = data?.videos || []

  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Welcome to MyTube</h1>
        </div>
        <div style={{ padding: '20rem', textAlign: 'center', color: '#888' }}>
          Loading videos...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-header__title">Welcome to MyTube</h1>
        </div>
        <div style={{ padding: '20rem', textAlign: 'center', color: '#f44336' }}>
          Error:{error instanceof Error ? error.message : 'Something went wrong'}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Welcome to MyTube!</h1>
      </div>

      <div className="video-grid">
        {videos?.map((video: Video) => {
          return (
            <Link href={`/watch?v=${video.publicId}`} className="video-card" key={video.id}>
              <div className="video-card__thumbnail">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${video.thumbnailPath}`}
                  alt={video.title}
                  className="video-card__avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* <span className="video-card__duration">{video.maxQuality}</span> */}
              </div>
              <div className="video-card__content">
                <img
                  src={
                    video.channel.avatarPath
                      ? `${process.env.NEXT_PUBLIC_API_URL}${video.channel.avatarPath}`
                      : `https://i.pravatar.cc/36?u=${video.channel.id}`
                  }
                  alt={video.channel.handle}
                  className="video-card__avatar"
                  style={{ width: 36, height: 36, borderRadius: '50%' }}
                />
                <div className="video-card__info">
                  <h3 className="video-card__title">{video.title}</h3>
                  <div className="video-card__channel">@{video.channel.handle}</div>
                  <p className="video-card__meta">
                    <span>{video.views} views</span>
                    <span>
                      {new Date(video.publishedAt || video.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

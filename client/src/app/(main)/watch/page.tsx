import { Avatar, Button } from '@/common/components/ui'
import { HiOutlineHeart } from 'react-icons/hi'

export default function WatchPage() {
  return (
    <div className="watch-page">
      <div className="watch-page__main">
        <div className="video-player">
          <div className="video-player__placeholder">Video ID:{0 || 'Not video selected'}</div>
        </div>
        <div className="video-info">
          <h2 className="video-info__title">Video title</h2>
          <div className="video-info__meta">
            <div className="video-info__stats">
              <span className="video-info__views">12345 views</span>
              <span className="video-info__date">2days ago</span>
            </div>
            <div className="video-info__actions">
              <button className="video-info__action">
                <HiOutlineHeart />
                <span>342</span>
              </button>
            </div>
          </div>
        </div>

        <div className="channel-info">
          <div className="channel-info__left">
            <Avatar src={undefined} size="lg" />
            <div className="channel-info__details">
              <a href="/channel/@channel" className="channel-info__name">
                Channel name
              </a>
              <span className="channel-info__subscribers">125K subscribers</span>
            </div>
          </div>
          <Button>Subscribe</Button>
        </div>
        <div className="video-description">
          <div className="video-description__content">Video description will appear</div>
        </div>

        <div className="comments-section">
          <div className="comments-section__header">
            <h3 className="comments-section__title">Comments</h3>
            <span>0</span>
          </div>
          <form className="comments-section__form">
            <textarea placeholder="Add a comment..." rows={2} className="comments-section__input" />
            <Button type="button" variant="primary">
              Comment
            </Button>
          </form>
          <div className="comments-section__list"></div>
        </div>
      </div>
      <div className="watch-page__sidebar">
        <div className="similarar-videos">
          <h3 className="similar-videos__header">Similar videos</h3>
          <div className="similar-videos__list"></div>
        </div>
      </div>
    </div>
  )
}

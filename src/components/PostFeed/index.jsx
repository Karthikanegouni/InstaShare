import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import PostFeedItem from '../PostFeedItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PostFeed extends Component {
  state = {
    postFeedList: [],
    apiStatus: apiStatusConstants.initial,
    isLikedIds: [],
    isMobile: window.innerWidth <= 768,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange)
    this.getPostFeedData()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange)
  }

  handleWindowSizeChange = () => {
    this.setState({isMobile: window.innerWidth <= 768})
  }

  getPostFeedData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const accessToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      headers: {Authorization: `Bearer ${accessToken}`},
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()

      const updatedData = data.posts.map(post => ({
        postId: post.post_id,
        userId: post.user_id,
        userName: post.user_name,
        profilePic: post.profile_pic,
        postDetails: post.post_details,
        likesCount: post.likes_count,
        comments: post.comments,
        createdAt: post.created_at,
      }))

      this.setState({
        postFeedList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } catch (error) {
      console.error(error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  selectLike = async postId => {
    const accessToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    // Optimistically remove like
    this.setState(prev => ({
      isLikedIds: prev.isLikedIds.filter(id => id !== postId),
    }))

    try {
      await fetch(url, {
        method: 'POST',
        headers: {Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify({like_status: false}),
      })
    } catch (error) {
      console.error(error)
      // Rollback if API fails
      this.setState(prev => ({isLikedIds: [...prev.isLikedIds, postId]}))
    }
  }

  selectUnlike = async postId => {
    const accessToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    // Optimistically add like
    this.setState(prev => ({isLikedIds: [...prev.isLikedIds, postId]}))

    try {
      await fetch(url, {
        method: 'POST',
        headers: {Authorization: `Bearer ${accessToken}`},
        body: JSON.stringify({like_status: true}),
      })
    } catch (error) {
      console.error(error)
      // Rollback if API fails
      this.setState(prev => ({
        isLikedIds: prev.isLikedIds.filter(id => id !== postId),
      }))
    }
  }

  renderPostFeedSuccessView = () => {
    const {postFeedList, isLikedIds} = this.state

    return (
      <div className="post-feed-success-view">
        <ul className="post-feed-list-container">
          {postFeedList.map(post => (
            <PostFeedItem
              key={post.postId}
              postFeedDetails={post}
              isLikedIds={isLikedIds}
              selectLike={this.selectLike}
              selectUnlike={this.selectUnlike}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderPostFeedLoadingView = () => {
    const {isMobile} = this.state
    return (
      <div
        className={
          isMobile
            ? 'mobile-post-feed-loader-container'
            : 'desktop-post-feed-loader-container'
        }
        testid="loader"
      >
        <Loader
          type="TailSpin"
          color="#4094EF"
          height={isMobile ? 48 : 80}
          width={isMobile ? 48 : 80}
        />
      </div>
    )
  }

  renderPostFeedFailureView = () => (
    <div className="post-feed-failure-view">
      <img
        className="post-feed-failure-view-image"
        src="https://res.cloudinary.com/dmlhm8dwi/image/upload/v1682953244/alert-trianglefailure-warning-icon-image_qdzegs.png"
        alt="failure view"
      />
      <h1 className="post-feed-failure-view-error">
        Something went wrong. Please try again
      </h1>
      <button
        type="button"
        className="post-feed-failure-view-button"
        onClick={this.getPostFeedData}
      >
        Try again
      </button>
    </div>
  )

  renderAllPostFeed = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPostFeedSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderPostFeedLoadingView()
      case apiStatusConstants.failure:
        return this.renderPostFeedFailureView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderAllPostFeed()}</>
  }
}

export default PostFeed

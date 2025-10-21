import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import StoryItem from '../StoryItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class StoriesSlider extends Component {
  state = {
    usersStories: [],
    apiStatus: apiStatusConstants.initial,
    isMobile: false,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange)
    this.handleWindowSizeChange()
    this.getStoriesData()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange)
  }

  handleWindowSizeChange = () => {
    const isMobile = window.innerWidth < 768
    this.setState({isMobile})
  }

  getStoriesData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const accessToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    try {
      const response = await fetch(apiUrl, options)
      if (!response.ok) throw new Error('Fetch failed')

      const data = await response.json()
      const updatedStories = data.users_stories.map(story => ({
        userId: story.user_id,
        userName: story.user_name,
        storyUrl: story.story_url,
      }))

      this.setState({
        usersStories: updatedStories,
        apiStatus: apiStatusConstants.success,
      })
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderStoriesLoadingView = () => {
    const {isMobile} = this.state
    const size = isMobile ? 32 : 48
    const loaderClass = isMobile
      ? 'mobile-stories-loader'
      : 'desktop-stories-loader'

    return (
      <div className="stories-loader-container" testid="loader">
        <Loader
          type="TailSpin"
          color="#4094EF"
          height={size}
          width={size}
          className={loaderClass}
        />
      </div>
    )
  }

  renderStoriesSliderView = () => {
    const {usersStories, isMobile} = this.state

    const settings = isMobile
      ? {
          dots: false,
          slidesToScroll: 1,
          slidesToShow: 4,
          centerPadding: '50px',
        }
      : {
          dots: false,
          slidesToScroll: 1,
          slidesToShow: 7,
          centerPadding: '50px',
        }

    const sliderClass = isMobile
      ? 'mobile-stories-slider'
      : 'desktop-stories-slider'

    return (
      <ul className={sliderClass}>
        <Slider {...settings}>
          {usersStories.map(eachStory => (
            <StoryItem key={eachStory.userId} storyDetails={eachStory} />
          ))}
        </Slider>
      </ul>
    )
  }

  renderStoriesFailureView = () => (
    <>
      <img
        className="stories-failure-view-image"
        src="https://res.cloudinary.com/dmlhm8dwi/image/upload/v1682953244/alert-trianglefailure-warning-icon-image_qdzegs.png"
        alt="failure view"
      />
      <p className="stories-failure-view-error">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="stories-failure-view-try-again-btn"
        onClick={this.getStoriesData}
      >
        Try again
      </button>
    </>
  )

  renderAllSliderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderStoriesSliderView()
      case apiStatusConstants.inProgress:
        return this.renderStoriesLoadingView()
      case apiStatusConstants.failure:
        return this.renderStoriesFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="stories-slider-container">
        {this.renderAllSliderViews()}
      </div>
    )
  }
}

export default StoriesSlider

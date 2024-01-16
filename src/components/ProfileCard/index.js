import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const ProfileCard = props => {
  const renderProfileCard = () => {
    const {profileDetails} = props
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-card-success-view">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  const renderLodingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  const renderFailurView = () => {
    const {getProfileDetails} = props

    return (
      <div className="loader-container">
        <button
          type="button"
          className="retry-button"
          onClick={getProfileDetails}
        >
          Retry
        </button>
      </div>
    )
  }

  const renderProfileCardViews = () => {
    const {profileApiStatus} = props

    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return renderLodingView()
      case apiStatusConstants.success:
        return renderProfileCard()
      case apiStatusConstants.failure:
        return renderFailurView()
      default:
        return null
    }
  }

  return (
    <div className="profile-card-container">{renderProfileCardViews()}</div>
  )
}

export default ProfileCard
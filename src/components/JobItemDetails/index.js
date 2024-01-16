import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {GoLinkExternal} from 'react-icons/go'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getUpdatedJobDetails = jobDetails => ({
    companyLogoUrl: jobDetails.company_logo_url,
    companyWebsiteUrl: jobDetails.company_website_url,
    employmentType: jobDetails.employment_type,
    id: jobDetails.id,
    jobDescription: jobDetails.job_description,

    skills: jobDetails.skills.map(skill => ({
      name: skill.name,
      imageUrl: skill.image_url,
    })),

    lifeAtCompany: {
      description: jobDetails.life_at_company.description,
      imageUrl: jobDetails.life_at_company.image_url,
    },

    location: jobDetails.location,
    packagePerAnnum: jobDetails.package_per_annum,
    rating: jobDetails.rating,
    title: jobDetails.title,
  })

  getUpdatedSimilarJobs = similarJobs =>
    similarJobs.map(job => ({
      companyLogoUrl: job.company_logo_url,
      id: job.id,
      rating: job.rating,
      employmentType: job.employment_type,
      jobDescription: job.job_description,
      location: job.location,
      title: job.title,
    }))

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedJobDetails = this.getUpdatedJobDetails(data.job_details)
      const updatedSmilarJobs = this.getUpdatedSimilarJobs(data.similar_jobs)

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSmilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    return (
      <ul className="similar-jobs-container">
        {similarJobs.map(job => (
          <SimilarJobs key={job.id} jobDetails={job} />
        ))}
      </ul>
    )
  }

  renderSkills = skills => (
    <ul className="skills-list-container">
      {skills.map(eachSkill => (
        <li key={eachSkill.name}>
          <img
            src={eachSkill.imageUrl}
            alt={eachSkill.name}
            className="skill-image"
          />
          <p>{eachSkill.name}</p>
        </li>
      ))}
    </ul>
  )

  renderJobItemDetails = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <div className="job-details-succes-view">
        <div className="job-details-card ">
          <div className="job-item-header">
            <img
              className="company-logo-image"
              alt="job details company logo"
              src={companyLogoUrl}
            />
            <div className="job-name-rating-container">
              <h1 className="job-title">{title}</h1>
              <div className="star-rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-info-container">
            <MdLocationOn className="location-icon" />
            <p>{location}</p>
            <BsBriefcaseFill className="job-icon" />
            <p>{employmentType}</p>
            <p className="salary">{packagePerAnnum}</p>
          </div>
          <hr className="separator" />
          <div className="job-description-header">
            <h1 className="job-item-details-subheading">Description</h1>
            <a href={companyWebsiteUrl}>
              <span>Visit</span>
              <GoLinkExternal className="visit-icon" />
            </a>
          </div>
          <p>{jobDescription}</p>
          <h1 className="job-item-details-subheading">Skills</h1>
          {this.renderSkills(skills)}

          <div className="job-item-details-life-style-container">
            <div>
              <h1 className="job-item-details-subheading">Life at Company</h1>
              <p>{lifeAtCompany.description}</p>
            </div>
            <img
              className="life-at-company-image"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        {this.renderSimilarJobs()}
      </div>
    )
  }

  renderLodingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemDetailsViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetails()
      case apiStatusConstants.inProgress:
        return this.renderLodingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="route-bg-container">
        <Header />
        <div className="job-item-details-container">
          {this.renderJobItemDetailsViews()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails

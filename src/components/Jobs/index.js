import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FilterGroup from '../FilterGroup'
import ProfileCard from '../ProfileCard'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const initialState = {
  searchInput: '',
  minimumPackage: '',
  FULLTIME: false,
  PARTTIME: false,
  FREELANCE: false,
  INTERNSHIP: false,
  HYDERABAD: false,
  BANGALORE: false,
  CHENNAI: false,
  DELHI: false,
  MUMBAI: false,
}

class Jobs extends Component {
  state = {
    ...initialState,
    jobsList: [],
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  updateEmploymentType = event => {
    const {name, checked} = event.target
    this.setState({[name]: checked}, this.getJobsList)
  }

  updateJobLocation = event => {
    const {name, checked} = event.target
    this.setState({[name]: checked})
  }

  updateMinimumPackage = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobsList)
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        profileImageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getModifiedJobsListData = jobsList =>
    jobsList.map(eachJob => ({
      companyLogoUrl: eachJob.company_logo_url,
      id: eachJob.id,
      employmentType: eachJob.employment_type,
      jobDescription: eachJob.job_description,
      location: eachJob.location,
      packagePerAnnum: eachJob.package_per_annum,
      rating: eachJob.rating,
      title: eachJob.title,
    }))

  getFormattedEmploymentQuery = () => {
    const {FULLTIME, PARTTIME, FREELANCE, INTERNSHIP} = this.state

    const employmentTypeArray = [
      FULLTIME ? 'FULLTIME' : '',
      PARTTIME ? 'PARTTIME' : '',
      FREELANCE ? 'FREELANCE' : '',
      INTERNSHIP ? 'INTERNSHIP' : '',
    ].filter(str => str !== '')

    const employmentTypeString = employmentTypeArray.join(',')

    return employmentTypeString
  }

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {searchInput, minimumPackage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const employmentTypeString = this.getFormattedEmploymentQuery()
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const {jobs} = await response.json()

    if (response.ok === true) {
      const updatedData = this.getModifiedJobsListData(jobs)
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeInput = event => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  renderSearchBar = () => {
    const {searchInput} = this.state

    return (
      <div className="searchbar-container">
        <input
          type="search"
          name="searchInput"
          value={searchInput}
          onChange={this.onChangeInput}
          placeholder="Search"
        />
        <div className="search-icon-container">
          <button
            type="button"
            data-testid="searchButton"
            onClick={this.getJobsList}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
      </div>
    )
  }

  renderJobItemsList = () => {
    const {jobsList, HYDERABAD, BANGALORE, CHENNAI, DELHI, MUMBAI} = this.state

    const locationsArray = [
      HYDERABAD ? 'HYDERABAD' : '',
      BANGALORE ? 'BANGALORE' : '',
      CHENNAI ? 'CHENNAI' : '',
      DELHI ? 'DELHI' : '',
      MUMBAI ? 'MUMBAI' : '',
    ]

    let filteredJobsList = jobsList.filter(eachJob =>
      locationsArray.includes(eachJob.location.toUpperCase()),
    )

    if (filteredJobsList.length === 0) {
      filteredJobsList = jobsList
    }

    return (
      <ul className="jobs-list-items-container">
        {filteredJobsList.map(eachJob => (
          <JobItem jobDetails={eachJob} key={eachJob.id} />
        ))}
      </ul>
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
      <button type="button" className="retry-button" onClick={this.getJobsList}>
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-view-container jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  renderJobsRouteViews = () => {
    const {jobsApiStatus, jobsList} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        if (jobsList.length === 0) return this.renderNoJobsView()
        return this.renderJobItemsList()
      case apiStatusConstants.inProgress:
        return this.renderLodingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {profileDetails, profileApiStatus} = this.state

    return (
      <div className="route-bg-container">
        <Header />
        <div className="job-route-container">
          <div className="profile-filter-group-container">
            <ProfileCard
              profileDetails={profileDetails}
              profileApiStatus={profileApiStatus}
              getProfileDetails={this.getProfileDetails}
            />
            <hr className="separator" />
            <FilterGroup
              updateEmploymentType={this.updateEmploymentType}
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              updateMinimumPackage={this.updateMinimumPackage}
              updateJobLocation={this.updateJobLocation}
            />
          </div>
          <div className="search-job-items-container">
            {this.renderSearchBar()}
            {this.renderJobsRouteViews()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
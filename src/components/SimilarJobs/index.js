import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobs = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    jobDescription,
  } = jobDetails

  return (
    <li className="similar-job-container">
      <div className="job-item-header">
        <img
          className="company-logo-image"
          alt="similar job company logo"
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
      <h1 className="description-title">Description</h1>
      <p className="job-description">{jobDescription}</p>
      <div className="job-item-info-container">
        <MdLocationOn className="location-icon" />
        <p>{location}</p>
        <BsBriefcaseFill className="job-icon" />
        <p>{employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarJobs
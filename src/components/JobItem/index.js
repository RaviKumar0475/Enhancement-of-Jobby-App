// import { Link } from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import {Link} from 'react-router-dom/cjs/react-router-dom.min'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails
  return (
    <li className="job-item-container">
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="job-item-header">
          <img
            className="company-logo-image"
            alt="company logo"
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
        <h1 className="description-title">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
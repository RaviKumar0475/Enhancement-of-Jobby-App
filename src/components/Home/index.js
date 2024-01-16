import {Link} from 'react-router-dom/cjs/react-router-dom.min'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="route-bg-container">
    <Header />
    <div className="home-route-container">
      <h1 className="home-route-heading">Find The Job That Fits Your Life</h1>
      <p className="home-route-description">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs">
        <button className="find-jobs-button" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
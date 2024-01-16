import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
// import { Link, withRouter } from 'react-router-dom'
import {Link, withRouter} from 'react-router-dom/cjs/react-router-dom.min'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <header className="header-container">
      <div className="mobile-navbar">
        <Link to="/">
          <img
            className="header-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="route-icons-container">
          <li>
            <Link to="/">
              <button type="button">
                <AiFillHome className="route-icon" />
              </button>
            </Link>
          </li>
          <li>
            <Link to="/jobs">
              <button type="button">
                <BsBriefcaseFill className="route-icon" />
              </button>
            </Link>
          </li>
          <li>
            <button type="button" onClick={onClickLogout}>
              <FiLogOut className="route-icon" />
            </button>
          </li>
        </ul>
      </div>
      <div className="desktop-navbar">
        <Link to="/">
          <img
            className="header-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="route-items">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>

        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default withRouter(Header)
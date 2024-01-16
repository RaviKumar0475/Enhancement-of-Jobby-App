import React from 'react'
import Cookies from 'js-cookie'
// import {Redirect } from 'react-router-dom'
import {Redirect} from 'react-router-dom/cjs/react-router-dom.min'

import './index.css'

const initialState = {
  username: '',
  password: '',
  errorMsg: '',
  showErrorMsg: false,
}

class Login extends React.Component {
  state = initialState

  onChaneInput = event => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({errorMsg, showErrorMsg: true})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  renderUsernameInput = () => {
    const {username} = this.state

    return (
      <div className="input-container">
        <label htmlFor="username">USERNAME</label>
        <input
          type="text"
          onChange={this.onChaneInput}
          value={username}
          name="username"
          id="username"
          placeholder="Username"
        />
      </div>
    )
  }

  renderPasswordInput = () => {
    const {password} = this.state

    return (
      <div className="input-container">
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          onChange={this.onChaneInput}
          value={password}
          name="password"
          id="password"
          placeholder="Password"
        />
      </div>
    )
  }

  render() {
    const {errorMsg, showErrorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg-container">
        <form className="login-form" onSubmit={this.onSubmitLoginForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          {this.renderUsernameInput()}
          {this.renderPasswordInput()}
          <button type="submit" className="login-button">
            Login
          </button>
          {showErrorMsg && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
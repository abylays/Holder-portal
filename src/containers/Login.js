import React, { useState } from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './Login.css'

export default function Login(props)
{
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function validateForm()
  {
    return username.length > 0 && password.length > 0
  }

  async function handleSubmit(event)
  {
    event.preventDefault()

    let networkMember
    try {
      networkMember = await window.sdk.fromLoginAndPassword(username, password)
      if (networkMember) {
        props.userHasAuthenticated(true)
      }

      /*if (props.acceptVCLink) {
        props.history.push(`/store-credentials?vcURL=${props.acceptVCLink}`)
      }*/
      else if (props.shareRequestToken) {
        props.history.push(`/share-credentials?token=${props.shareRequestToken}`)
      }
      else {
        props.history.push('/', { username })
      }

    } catch (error) {
      alert(error)
    }
  }

  return (
    <div className='Login'>
      <div className='Form'>
        <h1 className='Title'>Holder Login</h1>
        <p className='Info'>
          Login in order to continue
        </p>
        <form onSubmit={handleSubmit}>
          <FormGroup controlId='username' bsSize='large'>
            <ControlLabel className='Label'>Username</ControlLabel>
            <FormControl
              autoFocus
              className='Input'
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId='password' bsSize='large'>
            <ControlLabel className='Label'>Password</ControlLabel>
            <FormControl
              className='Input'
              type='password'
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </FormGroup>
          <Link className='Link' to='/reset-password'>Forgot password?</Link>
          <Button className='Button' block bsSize='large' disabled={!validateForm()} type='submit'>
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

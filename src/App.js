import React, {useEffect, useState} from 'react'
import Routes from './Routes'
import { Link, withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import './App.css'
import LOGO from './static/images/logoDDV2.png'

import SdkService from './utils/sdkService'
import {MessageService} from "./utils/messageService";

function App(props) {
  window.sdk = new SdkService()
  const [isAuthenticated, userHasAuthenticated] = useState(false)
  const [shareRequestToken, setShareRequestToken] = useState(null);
  const [acceptVCLink, setAcceptVCLink] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      window.sdk.init().then(networkMember => {
        window.messageService = new MessageService(networkMember)
      }).catch(console.error)
    } else {
      window.messageService = null
    }
  }, [isAuthenticated])

  async function handleLogout(event) {
    event.preventDefault()
    userHasAuthenticated(false)

    try {
      await window.sdk.signOut()
      props.history.push('/login')
    } catch (error) {
      console.log('error on logout', error)
    }
  }

  return (
    <div className='App'>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to='/'>
                <img src={LOGO} alt="logo" style={{height: '100px', width:'200px', paddingLeft: '20px', marginBottom: '20px'}} />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              { isAuthenticated
                ? <>
                    <NavItem onClick={handleLogout}>Logout</NavItem>
                  </>
                : <>
                    <LinkContainer to='/signup'>
                      <NavItem>Sign Up</NavItem>
                    </LinkContainer>
                    <LinkContainer to='/login'>
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes appProps={{ isAuthenticated, userHasAuthenticated, shareRequestToken,  setShareRequestToken, acceptVCLink, setAcceptVCLink}} />
    </div>
  )
}

export default withRouter(App)

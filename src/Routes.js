import React                  from 'react'
import { Switch }             from 'react-router-dom'
import AppliedRoute           from './components/AppliedRoute'
import Home                   from './containers/Home'
import Login                  from './containers/Login'
import NotFound               from './containers/NotFound'
import ShareCredential        from './containers/ShareCredential'
import AcceptCredential       from './containers/AcceptCredentials'
import Signup                 from './containers/Signup';
import StoreCredential        from './containers/StoreCredential'

export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path='/' exact component={Home} appProps={appProps} />
      <AppliedRoute path='/login' exact component={Login} appProps={appProps} />
      <AppliedRoute path='/signup' exact component={Signup} appProps={appProps} />
      <AppliedRoute path='/share-credentials' exact component={ShareCredential} appProps={appProps} />
      <AppliedRoute path='/accept-credentials' exact component={AcceptCredential} appProps={appProps} />
      <AppliedRoute path='/store-credentials' exact component={StoreCredential} appProps={appProps} />
      <AppliedRoute component={NotFound} />
    </Switch>
  )
}

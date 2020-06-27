import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import {
  Query
} from 'react-apollo'

import {
  get,
  map,
  concat,
  defaults,
} from 'lodash'

import {
  GET_USER,
  GET_USER_ID,
} from './queries'

import redirect from './redirect'
import AppContext from '../context/app-context'

import AboutPage from '../../pages/AboutPage'
import LoginPage from '../../pages/LoginPage'
import AdminPage from '../../pages/AdminPage'
import LandingPage from '../../pages/LandingPage'
import SignUpPage from '../../pages/SignUpPage'
import RecoverPage from '../../pages/RecoverPage'

const routes = {
  all: [
    { path: '/', component: LandingPage },
    { path: '/sobre', component: AboutPage },
  ],
  unauthenticated: [
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignUpPage },
  ],
  authenticated: [
    { path: '/admin', component: AdminPage },
  ],
  visitor: [
    { path: '/recuperar', component: RecoverPage },
  ],
}

const renderRoutes = ({ data, _loading }) => {
  let user = get(data, 'user', localStorage.getItem('token'))
  let routesToRender = user ? routes.authenticated : routes.unauthenticated 
  routesToRender = concat(routesToRender, routes.all)
  routesToRender = concat(routesToRender, routes.visitor)

  return (
    <Router>
      <AppContext.Provider value={ user }>
        <Switch>
          {
            map(routesToRender, (route, i) => {
              let routeProps = defaults({}, route, { key: i, exact: true })
              if (route.redirect) {
                routeProps.component = redirect(route.redirect)
              }

              return <Route { ...routeProps } />
            })
          }
        </Switch>
      </AppContext.Provider>
    </Router>
  )
}

const Routes = () => (
  <Query query={ GET_USER_ID }>
    { ({ data, _loading }) => {
      return (
        <Query query={ GET_USER } variables={{ id: get(data, 'currentUserId', 0) }}>
          { renderRoutes }
        </Query>
      )
    } }
  </Query>
)
export default Routes

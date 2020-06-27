import React from 'react'

import {
  Route
} from 'react-router-dom'
import _ from 'lodash'

import redirectToRoot from './redirectToRoot'

export default function PrivateRoute({
  authorizedProfiles = ['normal', 'manager', 'investor'],
  component: Component,
  render,
  user,
  ...rest
}) {
  let profile = user && user.profile

  if (!_(authorizedProfiles).includes(profile)) {
    return <Route { ...rest } component={ redirectToRoot } />
  }

  if (render) {
    return (
      <Route { ...rest } user={ user } render={ render } />
    )
  } else {
    return <Route { ...rest } render={
      (props) => <Component { ...props } user={ user } />
    } />
  }
}

import React from 'react'

import {
  withRouter
} from 'react-router-dom'
import AppContext from '../core/context/app-context'

export function withRouterUtils(Component) {
  const displayName = `withRouterUtils(${Component.displayName || Component.name})`
  const HOC = withRouter((props) => {
    let linkInsideProgram = (link) => `/${props.match.params.programKey}${link}`

    // Maybe put this in the Routes files dontknow
    // Better yet, draw some logic to generically get the routes with params and replace params from the object passed
    // TODO
    const withRouterUtilsLinks = {
      projectSubscriptionLink: ({ id }) => linkInsideProgram(`/projects/subscribe/${id}`)
    }

    // TODO namespace these extra props into one prop
    return (
      <Component
        linkInsideProgram={ linkInsideProgram }
        links={ withRouterUtilsLinks }
        program={ props.match.params.programKey }
        programKey={ props.match.params.programKey }
        { ...props }
      />
    )
  })

  // TODO remove program above (and fix where it breaks to use programKey)

  HOC.displayName = displayName
  return HOC
}

export function withCurrentUser(Component) {
  const displayName = `withCurrentUser(${Component.displayName || Component.name})`
  const HOC = ((props) => (
    <AppContext.Consumer>
      { (user) => (
        <Component
          currentUser={ user }
          { ...props }
        />
      ) }
    </AppContext.Consumer>
  ))

  HOC.displayName = displayName
  return HOC
}

import React from 'react'

import {
  Redirect
} from 'react-router-dom'
import _ from 'lodash'

export default (path, generateExtraProps = (_props) => ({})) => (
  (props) => {
    let redirectPath = path
    if (_.isFunction(path)) {
      redirectPath = path(props)
    }

    return <Redirect to={ redirectPath } { ...(generateExtraProps(props)) } />
  }
)

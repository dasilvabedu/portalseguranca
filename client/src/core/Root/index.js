import React from 'react'

import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'
import {
  Slide,
  ToastContainer
} from 'react-toastify'
import flatten from 'flat'
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';

import localeMessages from '../../locale_messages.yml'
import client from '../apollo-client'
import Routes from '../Routes'
import theme from '../themes/main';

class Root extends React.Component {
  render() {
    return (
      <ApolloProvider client={ client }>
        <ThemeProvider theme={ theme }>
          <StylesProvider injectFirst>
            <IntlProvider key="pt-BR" locale="pt-BR" messages={ flatten(localeMessages['pt-BR']) }>
              <Routes />
              <ToastContainer
                closeOnClick
                hideProgressBar
                pauseOnHover
                autoClose={ 3000 }
                draggable={ false }
                position="bottom-right"
                transition={ Slide }
              />
            </IntlProvider>
          </StylesProvider>
        </ThemeProvider>
      </ApolloProvider>
    )
  }
}

export default Root

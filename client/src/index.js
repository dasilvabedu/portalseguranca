import React from 'react'
import ReactDOM from 'react-dom'
import 'react-toastify/dist/ReactToastify.min.css'

import 'leaflet/dist/leaflet.css';

import Root from './core/Root'
import './index.css'

import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/dist/locale-data/pt'
import '@formatjs/intl-pluralrules/dist/locale-data/en'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/dist/locale-data/pt'
import '@formatjs/intl-relativetimeformat/dist/locale-data/en'

ReactDOM.render(<Root />, document.getElementById('root'))

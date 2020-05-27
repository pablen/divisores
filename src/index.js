import ReactDOM from 'react-dom'
import React from 'react'

import ConfigProvider from './ConfigProvider'
import '@reach/dialog/styles.css'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider />
  </React.StrictMode>,
  document.getElementById('root')
)

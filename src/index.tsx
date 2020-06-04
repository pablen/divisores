import ReactDOM from 'react-dom'
import React from 'react'

// Import first so that component styles can override them
import '@reach/dialog/styles.css'
import './index.css'

import ConfigProvider from './ConfigProvider'

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider />
  </React.StrictMode>,
  document.getElementById('root')
)

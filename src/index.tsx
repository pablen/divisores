import * as serviceWorker from './serviceWorker'
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

serviceWorker.register({
  onUpdate: (registration) => {
    const worker = registration.waiting || registration.installing
    if (!worker) return
    if (
      window.confirm(
        'Hay una versión nueva de la aplicación. ¿Querés actualizar?'
      )
    ) {
      worker.postMessage({ type: 'SKIP_WAITING' })
    }
  },
})

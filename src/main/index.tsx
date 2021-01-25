import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@/presentation/components'
import '@/presentation/styles/global.scss'
import { makelogin } from '@/presentation/factories/pages/login/login-fatory'

ReactDOM.render(
  <Router makelogin={makelogin}/>,
  document.getElementById('main')
)

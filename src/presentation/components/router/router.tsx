import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

type Props = {
  makelogin: React.FC
}

const Router: React.FC<Props> = ({ makelogin }: Props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={makelogin}/>
      </Switch>
    </BrowserRouter>
  )
}
export default Router

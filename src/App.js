import React from 'react'
import Example from './Example.js'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

const App = () => {
  return(
    <BrowserRouter>
    <Route exact path="/home/:filterValue"> 
    <Example />
    </Route>
    </BrowserRouter>
  )
}

export default App
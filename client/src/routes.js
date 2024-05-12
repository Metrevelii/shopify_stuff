import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './components/navigation/header';
import Footer from './components/navigation/footer';
import Home from './components/home'



function App() {
  return (
    <BrowserRouter className="App">
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
        </Switch>
        <Footer />
    </BrowserRouter>
  );
}

export default App;

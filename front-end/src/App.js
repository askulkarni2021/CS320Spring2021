import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import { Route } from 'react-router-dom'
import { createMuiTheme, CssBaseline, Fab, ThemeProvider } from '@material-ui/core';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import {
  blue,
  orange,
} from "@material-ui/core/colors";
//import { useHistory } from "react-router-dom";

let theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: blue[200],
    },
  }
})

export default function App() {
  const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false)
  const [darkState, setDarkState] = useState(localStorage.getItem('darkState') || false) ;
  const [palleteType, setPalleteType] = useState(localStorage.getItem('palleteType') || 'light');
  const [mainPrimary, setMainPrimary] = useState(localStorage.getItem('mainPrimary') || blue[200]);
  const [data, setData] = useState(localStorage.getItem('data') || null);
  const [uri, setUri] = useState(localStorage.getItem('uri') || null);
  //let history = useHistory();
  
  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  function setDataFromLogin(data, uri) {
    // right now only receiving uid, once backend hooks up
    // everything else, can setState for the other fields
    // setState asynchronous, so make sure the state is set
    // before window change
    setData(data);
    setUri(uri);
    localStorage.setItem('data', data);
    localStorage.setItem('uri', uri);
    setLoggedIn(true);
    // history.push('/home');
  }

  function logout(){
    localStorage.removeItem('uri');
    localStorage.removeItem('data');
    setLoggedIn(false);
  }
  
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn])

  useEffect(() => {
    localStorage.setItem('darkState', darkState);
    const palleteType = darkState ? "dark" : "light";
    const mainPrimary = darkState ? orange[500] : blue[500];
    setMainPrimary(mainPrimary);
    localStorage.setItem('mainPrimary', mainPrimary);
    setPalleteType(palleteType);
    localStorage.setItem('palleteType', palleteType);    
    theme = createMuiTheme({
      palette: {
        type: palleteType,
        primary: {
          main: mainPrimary
        },
      }
    })
  }, [darkState]);
  
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('mainPrimary', mainPrimary);
    localStorage.setItem('palleteType', palleteType);
    localStorage.setItem('darkState', darkState);  
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Fab color="primary" 
        aria-label="change theme" 
        onClick={() => handleThemeChange()}
        style={{position: 'fixed', top: 'auto', right: 20, bottom: 20, left: 'auto'}}
      >
        {darkState ? <Brightness7Icon/> : <Brightness2Icon/>}
      </Fab>
      <Route exact path="/" render={(props) => (
        (isLoggedIn && data && uri) ? <Home data={data} uri={uri} logout={logout.bind(this)}/> : <Login {...props} setDataFromLogin={setDataFromLogin.bind(this)}/>
      )}/>
      {/* <Route exact path="/home" render={() => (
        // similar to how uid is passed in, the other data would be as well
        <Home data={data} uri={uri}/>
      )}/> */}
    </ThemeProvider>
  );
};
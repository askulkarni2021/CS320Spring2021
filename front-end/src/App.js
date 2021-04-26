import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { Route } from 'react-router-dom';
import { createMuiTheme, CssBaseline, Fab, ThemeProvider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import {
  blue,
  orange,
} from "@material-ui/core/colors";
import { useHistory } from "react-router-dom";

let theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: blue[200],
    },
  }
})

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
  },
}));

export default function App() {
  const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false)
  const [darkState, setDarkState] = useState(localStorage.getItem('darkState') || false) ;
  const [palleteType, setPalleteType] = useState(localStorage.getItem('palleteType') || 'light');
  const [mainPrimary, setMainPrimary] = useState(localStorage.getItem('mainPrimary') || blue[200]);
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || null);
  const [uri, setUri] = useState(localStorage.getItem('uri') || null);
  const [uidEmployees, setUidEmployees] = useState();
  const [kudos, setKudos] = useState();
  const [reactions, setReactions] = useState(); 
  const classes = useStyles();
  let history = useHistory();

  // toggles darkState
  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  // passed down to Login.js, retrieves data from api call and sets state
  // accordingly, also updates isLoggedin
  function setDataFromLogin(data, uri) {
    // data = {
    // found: true/false
    // uid: uid of user
    // }
    setData(data);
    setUri(uri);
    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('uri', uri);
    setLoggedIn(true);
    history.push('/home');
  }

  // passed down to Navbar.js, removes saved data and updates isLoggedIn
  function logout(){
    localStorage.removeItem('uri');
    localStorage.removeItem('data');
    setData(null);
    setUri(null);
    setUidEmployees(null);
    setKudos(null);
    setLoggedIn(false);
    history.push('/');
  }

  // grabs uid_map_name for employees and all kudos
  // from specified uri.
  // Passed into Home, Navbar
  // Called when home feed first loads and when new kudo
  //        is added from AddKudo
  function getKudos() {
    const formData = {uri};
    fetch('http://localhost:5000/api/data/uid_map_name',
      {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json()).then(data => {
        setUidEmployees(data)
      });
    fetch('http://localhost:5000/api/all_kudos',
    {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json()).then(data => {
      setKudos(data)
    });
    fetch('http://localhost:5000/api/data/get_emojis',
        {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({uri})
        })
      .then(response => response.json())
      .then(data => {
          setReactions(data);
      });
  }

  // runs on isLoggedIn toggle, updates local storage to match
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn])

  // runs on darkState toggle and updates theme
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

  // runs on reload/first visit, sets intial local storage from state
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('mainPrimary', mainPrimary);
    localStorage.setItem('palleteType', palleteType);
    localStorage.setItem('darkState', 'false'); //original: darkState. proposing to make the default and on refresh white.
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
        (isLoggedIn && uri && data) ? null : <Login {...props} setDataFromLogin={setDataFromLogin.bind(this)}/>
      )}/>
      { (isLoggedIn && uri && data) ?
        <div className={classes.root}>
          <Navbar employees={uidEmployees} uid={data.uid} logout={logout.bind(this)} getKudos={getKudos.bind(this)}/>
            <div className={classes.content}>
              <Route exact path="/home" render={(props) => (
                <Home {...props} data={data} uri={uri} employees={uidEmployees} kudos={kudos} getKudos={getKudos.bind(this)} reactions={reactions}/>
              )}/>
              <Route exact path="/profile" render={(props) => (
                <Profile {...props} data={data} uri={uri} employees={uidEmployees} uid={data.uid}/>
              )}/>
            </div>
        </div>
      : null}
    </ThemeProvider>
  );
};

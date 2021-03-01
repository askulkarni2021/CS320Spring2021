import React, { Component, useState } from 'react';
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkState: localStorage.getItem('darkState') || false,
      palleteType: localStorage.getItem('palleteType') || 'light',
      mainPrimary: localStorage.getItem('mainPrimary') || blue[200],
    };
  }
  
  handleThemeChange = () => {
    this.setState({darkState: !this.state.darkState}, () => {
      const palleteType = this.state.darkState ? "dark" : "light";
      const mainPrimary = this.state.darkState ? orange[500] : blue[500];
      localStorage.setItem('darkState', this.state.darkState);
      this.setState({palleteType: palleteType, mainPrimary: mainPrimary}, () => {
        localStorage.setItem('palleteType', this.state.palleteType);
        localStorage.setItem('mainPrimary', this.state.mainPrimary);
      });
    });
  };

  render() {
    const theme = createMuiTheme({
      palette: {
        type: this.state.palleteType,
        primary: {
          main: this.state.mainPrimary
        },
      }
    })

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Fab color="primary" 
          aria-label="change theme" 
          onClick={() => this.handleThemeChange()}
          style={{position: 'absolute', right: '0', bottom: '0', margin: '20px'}}
        >
          {this.state.darkState ? <Brightness7Icon/> : <Brightness2Icon/>}
        </Fab>
        <Route exact path="/" component = { Login }/>
        <Route exact path="/home" component = { Home }/>
      </ThemeProvider>
    );
  }
}

export default App;

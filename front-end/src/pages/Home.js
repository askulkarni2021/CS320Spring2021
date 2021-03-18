import React, { useState, useEffect } from "react";
import {
  AppBar,
  Divider,
  Grid,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar';
import Kudo from '../components/Kudo';
import AddKudo from "../components/AddKudo";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
  },
  kudos: {
    paddingLeft: theme.spacing(2),
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
}));
  
export default function Home(props) {
  const [company, setCompany] = useState('');
  const [employees, setEmployees] = useState();
  const [kudos, setKudos] = useState();
  const classes = useStyles();

  // runs on reload/first visit, calls getKudos() and
  // sets company name from uri
  useEffect(() => {
    console.log(props.data);
    console.log(props.uri);
    getKudos();
    const companies = {
      'starship-entertainment': 'Starship Entertainment',
      'outback-tech': 'Outback Technology',
      'greenlife-consulting': 'Greenlife Consulting'
    }
    setCompany(companies[props.uri]);
  }, []);
  
  // api call to retrieve kudos based on uri, updates
  // employees state and kudos state
  function getKudos() {
    const uri = props.uri
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
        setEmployees(data)
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
  }


  return (
    <div className={classes.root}>
      <Navbar employees={employees} uid={props.data.uid} logout={props.logout}/>
      <div className={classes.content}>
        <AppBar position="sticky" elevation={0} className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6">{company}</Typography>
          </Toolbar>
          <Divider variant="middle"/>
        </AppBar>
        <Grid container justify="space-between">
          <Grid
          item xs={4}
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          className={classes.kudos}>
            <AddKudo getKudos={getKudos.bind(this)}/>
            {kudos && employees ? kudos.map((kudo, index) => {
                return <Kudo to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} key={index}/>
            }) : 'loading'  }
          </Grid>
          <Grid item xs={4}>
            {/* Rockstar goes here */}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

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
import Rockstar from '../components/Rockstar';
import Kudo from '../components/Kudo';

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
  const [employees, setEmployees] = useState({});
  const [kudos, setKudos] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    getKudos();
    const companies = {
      'starship-entertainment': 'Starship Entertainment',
      'outback-tech': 'Outback Technology',
      'greenlife-consulting': 'Greenlife Consulting'
    }
    setCompany(companies[localStorage.getItem('uri')]);
  }, []);

  function getKudos() {
    const uri = localStorage.getItem('uri')
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
      <Navbar/>
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
            {kudos && employees[5] ? kudos.map((kudo, index) => {
                return <Kudo to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} key={index}/>
            }) : 'loading'  }
          </Grid>
          <Grid item xs={4}>
            <Rockstar/>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

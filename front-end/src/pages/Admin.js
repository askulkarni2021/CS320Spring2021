import React, { useState, useEffect } from "react";
import {
  AppBar,
  Card,
  Divider,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Values from "../components/Values";
import Emojis from "../components/Emojis";
import ExportData from "../components/ExportData";
import ReportedKudos from "../components/ReportedKudos";


const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  stop: {
    backgroundColor: theme.palette.background.default,
  },
  reported: {
   padding: theme.spacing(2),
  },
  reports: {
    border: '1px solid rgba(255, 255, 255, 0.12)'
  },
  reasons: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  }
}));

export default function Home(props) {
  const [company, setCompany] = useState('');
  const [reportedKudos, setReportedKudos] = useState('')
  const classes = useStyles();

  useEffect(() => {
    getReportedKudos();
    const companies = {
      'starship-entertainment': 'Starship Entertainment',
      'outback-tech': 'Outback Technology',
      'greenlife-consulting': 'Greenlife Consulting'
    }
    setCompany(companies[props.uri]);
  }, []);

  function getReportedKudos() {
    const uri = props.uri
    fetch('http://localhost:5000/api/data/reported_kudo',
    {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({uri})
    })
    .then(response => response.json()).then(data => {
      if(data) {
        setReportedKudos(data)
      }
    });
  }

  return (
    <div className={classes.stop}>
      <AppBar position="sticky" elevation={0} className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">{company}</Typography>
        </Toolbar>
        <Divider variant="middle"/>
      </AppBar>
      <Grid container direction="column" justify="flex-start" alignItems="center">
        <Grid
        item xs={12}
        container
        direction="row"
        justify="center" alignItems="center"
        >
          <Values getKudos={props.getKudos}/>
          <Emojis getKudos={props.getKudos}/>
        </Grid>
        <Grid item xs={12}>
          <ExportData getKudos={props.getKudos}/>
        </Grid>


        <Grid
        item xl={32}
        container
        direction="row"
        alignItems="center"
        justify="space-around"
        className={classes.kudos}
        >
          <ReportedKudos employees={props.employees}/>
        </Grid>
        </Grid>
    </div>
  );
}

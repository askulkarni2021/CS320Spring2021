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
import Values from "../components/Values";
import Emojis from "../components/Emojis";
import ExportData from "../components/ExportData";

const useStyles = makeStyles(theme => ({
  kudos: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(6),
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  stop: {
    backgroundColor: theme.palette.background.default,
  }
}));

export default function Home(props) {
  const [company, setCompany] = useState('');
  const classes = useStyles();

  // runs on reload/first visit, calls getKudos() and
  // sets company name from uri
  useEffect(() => {
    console.log(props.data);
    console.log(props.uri);
    props.getKudos();
    const companies = {
      'starship-entertainment': 'Starship Entertainment',
      'outback-tech': 'Outback Technology',
      'greenlife-consulting': 'Greenlife Consulting'
    }
    setCompany(companies[props.uri]);
  }, []);

  return (
    <div className={classes.stop}>
      <AppBar position="sticky" elevation={0} className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">{company}</Typography>
        </Toolbar>
        <Divider variant="middle"/>
      </AppBar>
      <Grid container justify="space-between">
        <Grid
        item xs={16}
        container
        
        direction="row"
        justify="space-around"
        alignItems="center"
        className={classes.kudos}>
          <Values getKudos={props.getKudos}/>
          <Emojis getKudos={props.getKudos}/>
        </Grid>
        <Grid
        item xl={32}
        container
        direction="row"
        alignItems="center"
        justify="space-around"
        className={classes.kudos}
        >
          <ExportData getKudos={props.getKudos}/>
        </Grid>
      </Grid>
    </div>
  );
}

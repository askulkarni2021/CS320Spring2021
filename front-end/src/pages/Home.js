import React, { useState, useEffect } from "react";
import {
  AppBar,
  CircularProgress,
  Divider,
  Grid,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Rockstar from '../components/Rockstar';
import Kudo from '../components/Kudo';
import AddKudo from "../components/AddKudo";

const useStyles = makeStyles(theme => ({
  kudos: {
    paddingTop: theme.spacing(1),
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
        item xs={4}
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.kudos}>
          <AddKudo getKudos={props.getKudos}/>
          {props.kudos && props.employees ? props.kudos.map((kudo, index) => {
              return <Kudo 
                      to={props.employees[kudo.to].name} 
                      from={props.employees[kudo.from].name} 
                      message={kudo.kudo} 
                      tags={kudo.tags} 
                      kudoID={kudo._id}
                      kudoReactions={kudo.reactions}
                      compReactions={props.reactions}
                      key={kudo._id}
                      />
          }) : 
          <div style={{margin:'auto', marginTop: '50px'}}><CircularProgress/></div> }
        </Grid>
        <Grid item xs={4}>
          {<Rockstar/>}
        </Grid>
      </Grid>
    </div>
  );
}

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
import Kudo from "../components/Kudo"

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
        <Grid item xs={12}>
          <Paper style={{minWidth:"650px", minHeight:"50px"}}>
            {props.employees && reportedKudos && reportedKudos.length !== 0 ? reportedKudos.map((kudo, index) => {
              return (
                <div className={classes.reported}>
                  <div className={classes.reports}>
                    <Kudo
                      to={props.employees[kudo.to].name}
                      avatar={props.employees[kudo.to].avatar}
                      from={props.employees[kudo.from].name}
                      message={kudo.kudo}
                      tags={kudo.tags}
                      kudoID={kudo._id}
                      kudoReactions={kudo.reactions}
                      compReactions={props.reactions}
                      key={kudo._id}
                      timestamp={kudo.time}
                      getKudos={props.getKudos}
                      isAdmin={props.isAdmin}
                      getReportedKudos={getReportedKudos}
                    />
                    {kudo.report.map((value, index) => {
                      return (
                        <div>
                          <Divider variant="middle"/>
                          <Grid container direction="column" className={classes.reasons} >
                            <Grid item xs={12}>
                              <Typography variant="h6">Reported by: {props.employees[value.by].name}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="h6">Reason: {value.reason}</Typography>
                            </Grid>
                          </Grid>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            }) 
            : <div style={{textAlign: 'center', paddingTop: '8px'}}>
                <Typography variant="h6">No Reported Kudos</Typography>
              </div>
            }
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

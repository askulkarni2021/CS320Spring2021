import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar';
import Kudo from '../components/Kudo';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
  },
}));
  
export default function Home(props) {
  const [company, setCompany] = useState('');
  const [employees, setEmployees] = useState({});
  const [kudos, setKudos] = useState([]);
  const styles = useStyles();

  useEffect(() => {
    console.log('useeffect ran');
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
    <div className={styles.root}>
      <Navbar/>
      <div className={styles.content}>
          <Typography variant="h4" style={{margin: '20px'}}> {company} </Typography>
          <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"          
          >
          {kudos && employees[5] ? kudos.map((kudo, index) => {
              return <Kudo to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} index={index}/>
          }) : 'loading'  }
          </Grid>
      </div>
    </div>
  );
}

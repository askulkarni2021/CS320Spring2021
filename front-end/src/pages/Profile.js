import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Kudo from '../components/Kudo';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
    backgroundColor: theme.palette.background.default,
  },
  list: {
    width: 620,
  },
}));

export default function Profile(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');
  const [incoming, setIncoming] = useState();
  const [outgoing, setOutgoing] = useState();
  const [employees, setEmployees] = useState();

  useEffect(() => {
    getInOut();
  }, []);

  function getInOut() {
    const uri = props.uri;
    const uid = props.data.uid;
    const formData = {uri, uid}
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
    fetch('http://localhost:5000/api/profile_incoming',
    {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json()).then(data => {
      setIncoming(data)
    });
    fetch('http://localhost:5000/api/profile_outgoing',
    {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json()).then(data => {
      setOutgoing(data)
    });
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    <div className={classes.root}>
      <Grid className={classes.list}>
        <TabContext value={value}>
          <AppBar position="static">
            <TabList onChange={handleChange} aria-label="simple tabs example" centered>
              <Tab label="Incoming" value="1" />
              <Tab label="Outgoing" value="2" />
            </TabList>
          </AppBar>
          <TabPanel value="1">{incoming && employees ? incoming.map((kudo, index) => {
              return <Kudo to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} key={index}/>
          }) : 'loading'  }</TabPanel>
        <TabPanel value="2">{outgoing && employees ? outgoing.map((kudo, index) => {
              return <Kudo to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} key={index}/>
          }) : 'loading'  }</TabPanel>
        </TabContext>
      </Grid>
    </div>

  );
}

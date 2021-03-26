import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, TextField, Box } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Modal from '@material-ui/core/Modal';
import Kudo from '../components/Kudo';
import AddKudo from "../components/AddKudo";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
    backgroundColor: theme.palette.background.default,
  },
  list: {
    width: 640,
  },
  header: {
    height: 200,
    width: 800,
  },
  modalCenter: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: '0',
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
}));

export default function Profile(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');
  const [incoming, setIncoming] = useState();
  const [outgoing, setOutgoing] = useState();
  const [employees, setEmployees] = useState();
  const [showSettingVerify, toggleShowSettingVerify] = useState(false);
  const [verPass, setVerPass] = useState();
  const [newPass, setNewPass] = useState();

  useEffect(() => {
    getInOut();
  }, []);

  function handleSumbit() {
      console.log(verPass)
      toggleShowSettingVerify(false)
  }

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
      <Modal
        open={showSettingVerify}
        onClose={() => toggleShowSettingVerify(false)}
        aria-labelledby="add-kudo-modal"
        aria-describedby="add-kudo"
      >
        <div className={classes.modalCenter}>
          <Card style={{width: '600px', margin: '10px'}}>
              <CardContent>
                  <form onSubmit={(e) => {e.preventDefault(); handleSumbit();}}>
                      <TextField
                          label='Password'
                          variant='outlined'
                          multiline
                          rows={1}
                          value={verPass}
                          fullWidth
                          onChange={(e) => setVerPass(e.target.value)}
                      />
                    <Button type="submit" variant="contained" color="primary">Verify Password</Button>
                  </form>
              </CardContent>
          </Card>
        </div>
      </Modal>
      <AppBar position="sticky" elevation={0} className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">Profile</Typography>
        </Toolbar>
        <Divider variant="middle"/>
      </AppBar>
      <Grid className={classes.header}>

      </Grid>
      <Grid className={classes.list}>
        <Box style={{maxHeight: '650px', overflow: 'auto'}}>
        <TabContext value={value}>
          <AppBar position="sticky">
            <TabList onChange={handleChange} aria-label="simple tabs example" centered>
              <Tab label="Incoming" value="1" />
              <Tab label="Outgoing" value="2" />
              <Tab label="Settings" value="3" onClick={() =>  toggleShowSettingVerify(true)}/>
            </TabList>
          </AppBar>
          <TabPanel value="1">{incoming && employees ? incoming.map((kudo, index) => {
              return <Kudo to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} key={index}/>
          }) : 'loading'  }</TabPanel>
          <TabPanel value="2">{outgoing && employees ? outgoing.map((kudo, index) => {
                return <Kudo to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} key={index}/>
            }) : 'loading'  }</TabPanel>
          <TabPanel value="3">
            <Grid>
              <Card style={{width: '600px', margin: '10px'}}>
                  <CardContent>
                      <Typography variant="h6">Enter New password:</Typography>
                    <form onSubmit={(e) => {e.preventDefault(); handleSumbit();}}>
                        <TextField
                            label='Password'
                            variant='outlined'
                            multiline
                            rows={1}
                            value={newPass}
                            fullWidth
                            onChange={(e) => setNewPass(e.target.value)}
                        />
                      <Button type="submit" variant="contained" color="primary">Enter Password</Button>
                    </form>
                  </CardContent>
                </Card>
            </Grid>
          </TabPanel>
        </TabContext>
        </Box>
      </Grid>
    </div>

  );
}

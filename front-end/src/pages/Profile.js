import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, TextField, Box, Input, AppBar, Toolbar, Typography, Divider, Tab, Grid, Avatar, Modal} from '@material-ui/core';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Kudo from '../components/Kudo';
import { red } from '@material-ui/core/colors';
import ChangeAvatar from '../components/ChangeAvatar';
import pic1 from '../components/Avatar Pics/female.png';
import pic2 from '../components/Avatar Pics/male.png';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
    backgroundColor: theme.palette.background.default,
  },
  list: {
    width: 750,
  },
  header: {
    height: 230,
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
  const [pass, setPass] = useState();
  const [valid, setValid] = useState(false);
  const [newPass, setNewPass] = useState();
  const [avatar, setAvatar] = useState('');
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  useEffect(() => {
    getInOut();
  }, []);

  function handleSumbitNewPass() {
      console.log(newPass)
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

  function handleSumbitVerify() {
    const uri = props.uri;
    const uid = props.data.uid;
    const formData = {uri, uid, pass}
    fetch('http://localhost:5000/api/verify_settings',
    {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json()).then(data => {
      if(data.found) {
        toggleShowSettingVerify(false)
        setValid(false)
      } else {
        setValid(true)
        console.log('WrongPass')
      }
    });
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmitAvatar = (newAvatar) => {
    setAvatar(newAvatar);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalVisible(false);
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
                  <form onSubmit={(e) => {e.preventDefault(); handleSumbitVerify();}}>
                      <TextField
                          label='Password'
                          variant='outlined'
                          error={valid}
                          multiline
                          rows={1}
                          value={pass}
                          fullWidth
                          onChange={(e) => setPass(e.target.value)}
                      />
                    <Button type="submit" variant="contained" color="primary">Verify Password</Button>
                    {valid ? <Typography variant="caption" display="block" color="error"> password is incorrect </Typography> : null}
                  </form>
              </CardContent>
          </Card>
        </div>
      </Modal>

      <Modal
        open={isAvatarModalVisible}
        onClose={() => setIsAvatarModalVisible(false)}
        aria-labelledby="change-avatar-modal"
        aria-describedby="change-avatar"
      >
        <div className={classes.modalCenter}>
          <ChangeAvatar handleSubmitAvatar={handleSubmitAvatar} pic1={pic1} pic2={pic2} closeAvatarModal={closeAvatarModal}/>
        </div>
      </Modal>

      <AppBar position="sticky" elevation={0} className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">Profile</Typography>
        </Toolbar>
        <Divider variant="middle"/>
      </AppBar>

      <Grid className={classes.header} container justify='flex-end'>
        <Grid style={{marginTop: '70px', paddingRight: '20px',}}>
          <Box textAlign="right" >
            <Typography style={{fontSize: '12px', color: 'grey',}}>Name</Typography>
          </Box>
          <Box textAlign="right" >
            <Typography style={{fontSize: '18px'}}>Kianna Westervelt</Typography>
          </Box>
          <Box textAlign="right" >
            <Typography style={{fontSize: '12px', color: 'grey', marginTop: '13px',}}>Position</Typography>
          </Box>
          <Box textAlign="right" >
            <Typography style={{fontSize: '18px'}}>Software Engineer</Typography>
          </Box>
          

        </Grid>
        <Grid  style={{marginTop: '50px',}}>
            <Avatar alt="Remy Sharp" 
            style={{ height: '150px', width: '150px', marginLeft: '10px',}} 
            src={avatar}
            onClick={() => setIsAvatarModalVisible(true)} />
        </Grid>
      </Grid>

      
      
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        
      >
        <Grid item xs={10}>
      <Grid className={classes.list}>
        <Box style={{maxHeight: '635px', overflow: 'auto'}}>
        <TabContext value={value}>
          <AppBar position="sticky">
            <TabList onChange={handleChange} aria-label="simple tabs example" centered>
              <Tab label="Incoming" value="1" />
              <Tab label="Outgoing" value="2" />
              <Tab label="Settings" value="3" onClick={() =>  toggleShowSettingVerify(true)}/>
            </TabList>
          </AppBar>
          <TabPanel value="1">{incoming && employees ? incoming.map((kudo, index) => {
              return <Kudo to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} tags={kudo.tags} key={kudo._id}/>
          }) : 'loading'  }</TabPanel>
          <TabPanel value="2">{outgoing && employees ? outgoing.map((kudo, index) => {
                return <Kudo to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} tags={kudo.tags} key={kudo._id}/>
            }) : 'loading'  }</TabPanel>
          <TabPanel value="3">
            <Grid>
              <Card style={{width: '600px', margin: '10px'}}>
                  <CardContent>
                      <Typography variant="h6">Enter New password:</Typography>
                    <form onSubmit={(e) => {e.preventDefault(); handleSumbitNewPass();}}>
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
      </Grid>
      </Grid>
    </div>

  );
}

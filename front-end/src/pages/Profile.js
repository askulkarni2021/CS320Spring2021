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
  const [invalid, setInvalid] = useState(false);
  const [newPass, setNewPass] = useState();
  const [avatar, setAvatar] = useState('');
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [company, setCompany] = useState('');
  const [name, setEmployeeName] = useState('');
  const [position, setEmployeePosition] = useState('');

  useEffect(() => {
    getInOut();
    const companies = {
      'starship-entertainment': 'Starship Entertainment',
      'outback-tech': 'Outback Technology',
      'greenlife-consulting': 'Greenlife Consulting'
    }
    setCompany(companies[props.uri]);
  }, []);

  useEffect(() => {
    if(props.employees){
      setEmployeeName(props.employees[props.uid]['name']);
      setEmployeePosition(props.employees[props.uid]['position']);
      setAvatar(props.employees[props.uid]['avatar']);
    }
  }, [props.employees]);

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

  function handleSumbitNewPass() {
    const uri = props.uri;
    const uid = props.data.uid;
    const password = newPass;
    const formData = {uid, password, uri};
    fetch('http://localhost:5000/api/data/change_password',
    {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json()).then(data => {
      // console.log(newPass)
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
        setInvalid(false)
        handleSumbitNewPass();
        setPass('');
        setNewPass('');
      } else {
        setInvalid(true)
        setPass('')
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
        onClose={() => {toggleShowSettingVerify(false); setPass(''); setNewPass('');}}
        aria-labelledby="add-kudo-modal"
        aria-describedby="add-kudo"
      >
        <div className={classes.modalCenter}>
          <Card style={{width: '600px', margin: '10px'}}>
              <CardContent>
                  <form onSubmit={(e) => {e.preventDefault(); handleSumbitVerify();}}>
                    <Grid container direction={"column"} spacing={5}>
                      <Grid item>
                        <Typography>Enter Current Password:</Typography>
                      <TextField
                          label='Current Password'
                          variant='outlined'
                          error={invalid}
                          multiline
                          rows={1}
                          value={pass}
                          fullWidth
                          onChange={(e) => setPass(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <Typography>Enter New Password:</Typography>
                      <TextField
                          label='Password'
                          variant='outlined'
                          multiline
                          rows={1}
                          value={newPass}
                          fullWidth
                          onChange={(e) => setNewPass(e.target.value)}
                      />
                  </Grid>
                  <Grid item>
                    <Button type="submit" variant="contained" color="primary">Change Password</Button>
                    {invalid ? <Typography variant="caption" display="block" color="error"> password is incorrect </Typography> : null}
                  </Grid>
                </Grid>
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
          <ChangeAvatar handleSubmitAvatar={handleSubmitAvatar} pic1={pic1} pic2={pic2} closeAvatarModal={closeAvatarModal} uid={props.data.uid}/>
        </div>
      </Modal>

      <AppBar position="sticky" elevation={0} className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6">{company}</Typography>
        </Toolbar>
        <Divider variant="middle"/>
      </AppBar>
      <Grid className={classes.header} container justify='flex-end'>
        <Grid style={{marginTop: '115px', paddingRight: '110px'}}>
          <Button type="submit" variant="contained" color="primary" onClick={() => {toggleShowSettingVerify(true); setInvalid(false);}}>Change Password</Button>
        </Grid>
        <Grid style={{marginTop: '70px', paddingRight: '20px',}}>
          <Box textAlign="right" >
            <Typography style={{fontSize: '12px', color: 'grey',}}>Name</Typography>
          </Box>
          <Box textAlign="right" >
            <Typography style={{fontSize: '18px'}}>{name}</Typography>
          </Box>
          <Box textAlign="right" >
            <Typography style={{fontSize: '12px', color: 'grey', marginTop: '13px',}}>Position</Typography>
          </Box>
          <Box textAlign="right" >
            <Typography style={{fontSize: '18px'}}>{position}</Typography>
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
            </TabList>
          </AppBar>
          <TabPanel value="1">{incoming && employees ? incoming.map((kudo, index) => {
              return <Kudo 
                      to={employees[kudo.to].name} 
                      from={employees[kudo.from].name} 
                      message={kudo.kudo} tags={kudo.tags} 
                      tags={kudo.tags}
                      key={kudo._id} 
                      kudoID={kudo._id}
                      kudoReactions={kudo.reactions}
                      compReactions={props.reactions}
                      timestamp={kudo.time}
                      avatar={employees[kudo.to].avatar} 
                      />
          }) : 'loading'  }</TabPanel>
          <TabPanel value="2">{outgoing && employees ? outgoing.map((kudo, index) => {
                return <Kudo 
                        to={employees[kudo.to].name} 
                        from={employees[kudo.from].name} 
                        message={kudo.kudo} 
                        tags={kudo.tags} 
                        kudoID={kudo._id}
                        kudoReactions={kudo.reactions}
                        compReactions={props.reactions}
                        key={kudo._id} 
                        timestamp={kudo.time}
                        avatar={employees[kudo.to].avatar}
                        />
            }) : 'loading'  }</TabPanel>
        </TabContext>
        </Box>
      </Grid>
      </Grid>
      </Grid>
    </div>

  );
}

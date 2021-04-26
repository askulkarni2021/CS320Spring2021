import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Drawer, CssBaseline, List, MenuList, MenuItem , Button, Avatar, Box, Grid, Typography, Modal} from '@material-ui/core'
import Emoji from '../components/Emoji';
import AddKudo from "./AddKudo";
import { useHistory } from "react-router-dom";

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    paddingLeft: '80px',
  },
  menuItem: {
    marginLeft: '0px',
    borderRadius: '50px',
    marginBottom: '10px',
    paddingTop: '13px',
    paddingBottom: '13px',
    paddingLeft: '23px',
    paddingRight: '23px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.main
    }
  },
  logout: {
    borderRadius: '50px',
    padding: '1px 4px',
    marginLeft: '24px',
    marginTop: '10px',
  },
  dumb: {
    paddingLeft: '10px',
    marginLeft: '23px',
  },
  modalCenter: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: '0',
  }
}));
export default function Navbar(props) {
  const classes = useStyles();
  const [name, setEmployeeName] = useState('');
  const [position, setEmployeePosition] = useState('');
  const [showAddKudo, toggleShowAddKudo] = useState(false);
  let history = useHistory();

  useEffect(() => {
    if(props.employees){
      setEmployeeName(props.employees[props.uid]['name']);
      setEmployeePosition(props.employees[props.uid]['position']);
    }
  }, [props.employees]);

  return (
    <div>
      <CssBaseline/>
      <Modal
        open={showAddKudo}
        onClose={() => toggleShowAddKudo(false)}
        aria-labelledby="add-kudo-modal"
        aria-describedby="add-kudo"
      >
        <div className={classes.modalCenter}>
          <AddKudo getKudos={props.getKudos} toggleShowAddKudo={toggleShowAddKudo}/>
        </div>
      </Modal>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <List>
          <Box textAlign="left" className={classes.dumb}>
            <Typography variant="h2">Kudos</Typography>
          </Box>
          <Grid container direction="column" alignItems="flex-start" justify="center" className={classes.dumb}>
              <Avatar alt="Remy Sharp" src={props.employees[props.uid]['avatar']} style={{ height: '140px', width: '140px', marginTop: '10px', marginBottom: '10px' }} />
          </Grid>
          <Box textAlign="left" className={classes.dumb}>
            <Typography variant="h5">{name}</Typography>
          </Box>
          <Box textAlign="left" className={classes.dumb}>
            <Typography variant="subtitle1">{position}</Typography>
          </Box>
          <MenuList>
              <Grid container direction="column" alignItems="flex-start" justify="center">
                  <MenuItem className={classes.menuItem} onClick={() => history.push('/home')}>
                    <Typography variant="h4"><Emoji symbol="🏠" label="home"/>Home</Typography>
                  </MenuItem>
                  <MenuItem className={classes.menuItem} onClick={() => history.push('/profile')}>
                    <Typography variant="h4"><Emoji symbol="😺" label="cat"/>Profile</Typography>
                  </MenuItem>
                  <MenuItem className={classes.menuItem} onClick={() => history.push('/admin')}>
                    <Typography variant="h4"><Emoji symbol="📢" label="loudspeaker"/>Admin</Typography>
                  </MenuItem>
                  <Grid container direction="column" alignItems="flex-start" justify="center" className={classes.dumb}>
                    <Button variant="contained" size="large" color="primary" onClick={() => toggleShowAddKudo(true)}>+ Give Kudos</Button>
                  </Grid>
                  <MenuItem m={1} onClick={()=>props.logout()} className={classes.logout}>
                    <Typography variant="overline"><Emoji symbol="🌊" label="wave"/>Logout</Typography>
                  </MenuItem>
              </Grid>
          </MenuList>
        </List>
      </Drawer>
    </div>
  );
}

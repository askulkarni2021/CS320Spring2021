import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Drawer, CssBaseline, List, MenuList, MenuItem , Button, Avatar, Box, Grid, Typography} from '@material-ui/core'
import Emoji from '../components/Emoji';
<<<<<<< HEAD
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Route, Link } from 'react-router-dom'
=======
>>>>>>> e4de67bf3f99f74c9cbac77bd4960e9ddb2194ed

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    paddingLeft: '100px',
  },
  menuItem: {
    borderRadius: '50px',
    marginBottom: '10px',
    paddingLeft: '10px',
    paddingRight: '10px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.main
    }
  },
  logout: {
    borderRadius: '50px',
    padding: '1px 4px',
    marginLeft: '6px',
    marginTop: '10px',
  },
  dumb: {
    paddingLeft: '10px',
    marginLeft: '0',
  }
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div>
      <CssBaseline/>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >        
        <List>
<<<<<<< HEAD
            <Box textAlign="center" m={1} fontSize={50}>Kudos</Box>
            <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                <Avatar alt="Remy Sharp" src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg" style={{ height: '140px', width: '140px' }} />
            </Grid>
            <Box textAlign="center" m={1} fontSize={25}>Kianna Westervelt</Box>
            <Box textAlign="center" m={1} fontSize={15}>Software Engineer</Box>
            <MenuList>
                <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                    <MenuItem component={Link} to={'/home'}><Emoji symbol="🏠"/> Home</MenuItem>
                    <MenuItem component={Link} to={'/profile'}><Emoji symbol="😺"/> Profile</MenuItem>
                    <MenuItem component={Link} to={'/'}><Emoji symbol="🌊"/>Logout</MenuItem>
                </Grid>
            </MenuList>
            <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                <Button variant="contained" size="large">+ Give Kudos</Button>
            </Grid>
=======
          <Box textAlign="left" className={classes.dumb}>
            <Typography variant="h2">Kudos</Typography>
          </Box>
          <Grid container direction="column" alignItems="flex-start" justify="center" className={classes.dumb}>
              <Avatar alt="Remy Sharp" src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg" style={{ height: '140px', width: '140px', marginTop: '10px', marginBottom: '10px' }} />
          </Grid>
          <Box textAlign="left" className={classes.dumb}>
            <Typography variant="h5">Kianna Westervelt</Typography>
          </Box>
          <Box textAlign="left" className={classes.dumb}>
            <Typography variant="subtitle1">Software Engineer</Typography>  
          </Box>
          <MenuList>
              <Grid container direction="column" alignItems="flex-start" justify="center">
                  <MenuItem className={classes.menuItem}>
                    <Typography variant="h4"><Emoji symbol="🏠"/>Home</Typography>
                  </MenuItem>
                  <MenuItem className={classes.menuItem}>
                    <Typography variant="h4"><Emoji symbol="😺"/>Profile</Typography>
                  </MenuItem>
                  <Grid container direction="column" alignItems="flex-start" justify="center" className={classes.dumb}>
                    <Button variant="contained" size="large" color="primary">+ Give Kudos</Button>
                  </Grid>
                  <MenuItem m={1} className={classes.logout}>
                    <Typography variant="overline"><Emoji symbol="🌊"/>Logout</Typography>
                  </MenuItem>
              </Grid>
          </MenuList>
>>>>>>> e4de67bf3f99f74c9cbac77bd4960e9ddb2194ed
        </List>
      </Drawer>
    </div>
  );
}

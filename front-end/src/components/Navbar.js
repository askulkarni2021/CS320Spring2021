import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Emoji from '../components/Emoji';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >

        <div className={classes.toolbar} />
        
        <List>
            <Box textAlign="center" m={1} fontSize={50}>Kudos</Box>
            <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                <Avatar alt="Remy Sharp" src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg" style={{ height: '140px', width: '140px' }} />
            </Grid>
            <Box textAlign="center" m={1} fontSize={25}>Kianna Westervelt</Box>
            <Box textAlign="center" m={1} fontSize={15}>Software Engineer</Box>
            <MenuList>
                <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                    <MenuItem><Emoji symbol="🏠"/> Home</MenuItem>
                    <MenuItem><Emoji symbol="😺"/> Profile</MenuItem>
                    <MenuItem><Emoji symbol="🌊"/>Logout</MenuItem>
                </Grid>
            </MenuList>
            <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                <Button variant="contained" size="large">+ Give Kudos</Button>
            </Grid>
        </List>
        
      </Drawer>
    </div>
  );
}

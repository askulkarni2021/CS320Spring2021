import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import clsx from 'clsx';
import RockstarKudos from '../components/RockstarKudos';


const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 250,
    flexShrink: 0,
  },
  drawerPaper: {
    variant:"elevation3",
    width: 250,
    height: 800,
    backgroundColor: 'transparent',
    border: 'none',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {

  },
}));

export default function Rockstar(props) {
  const classes = useStyles();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  const [expanded, setExpanded] = useState(false);
  // const [rockstar, setRockstar] = useState({})
  const [user, setUser] = useState('');
  const [position, setPosition] = useState('');
  const [numKudos, setNumKudos] = useState();
  const [month, setMonth] = useState();
  const [incoming, setIncoming] = useState();
  // const [kudos, setKudos] = useState();
  const [employees, setEmployees] = useState();
  // const [testKudos, setTestKudos] = useState();
  //const uri = localStorage.getItem('uri');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    getRockstarAndIncoming();
  }, []);

  // TODO: right now numKudos is the number of kudos the ROM recieved last month
  // however, we are displaying the kudos the ROM has recieved so far this month
  // in the ROM collection, we need to store the kudos from last month
  function getRockstarAndIncoming() {
	const uri = localStorage.getItem('uri');
    const formData = {uri}
    fetch('http://localhost:5000/api/get_rockstar',
    {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json()).then(data => {
      // console.log(data)
      // setRockstar(data)
      setUser(data.name)
      setPosition(data.position)
      setNumKudos(data.numKudos)
      setMonth(data.month)
      console.log(data.month)
	  // put this function inside the response promise handle so we access to the uid of ROM
	  // for some reason, the react state variable are undefined when trying to access them
	  // in the function itself. a fix to this (idk best way to do it) is to put this function
	  // inside the response handle so that we have access to the uid. this means we no longer need a
	  // state for uid
  	  function getRockstarIncoming() {
  	    // NEED to figure out how to get the uid from state
		const uid = data.employeeId;
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
  	  }
	  getRockstarIncoming();
    });
  }

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{paper: classes.drawerPaper}}
        anchor="right"
      >
        <Card>
        <CardHeader
        titleTypographyProps={{variant:'h6' }}
        title="Rockstar of the Month"
        subheader={monthNames[month-1]}
        />
        </Card>
        <Card>
          <CardHeader
          avatar={
            <Avatar aria-label="Rockstar" alt="Remy Sharp" className={classes.avatar} />
          }
          title={user}
          subheader={position}
          />
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" component="p" color="textSecondary">
                Kudos recieved this month: {numKudos}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Box style={{maxHeight: '530px', overflow: 'auto'}}>
                <Grid
                item xs={4}
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                className={classes.kudos}>
                  {incoming && employees ? incoming.map((kudo, index) => {
                      return <RockstarKudos to={employees[kudo.to].name} from={employees[kudo.from].name} message={kudo.kudo} key={index}/>
                  }) : 'loading'  }
                </Grid>
              </Box>
            </CardContent>
          </Collapse>
        </Card>
      </Drawer>
    </div>
  );
}

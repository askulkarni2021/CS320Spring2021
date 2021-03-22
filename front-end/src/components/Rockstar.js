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
  const [expanded, setExpanded] = useState(false);
  const [rockstar, setRockstar] = useState({})
  const [user, setUser] = useState('');
  const [position, setPosition] = useState('');
  const [numKudos, setNumKudos] = useState();
  const [uid, setUid] = useState('');
  const [incoming, setIncoming] = useState();
  const [kudos, setKudos] = useState();
  const [employees, setEmployees] = useState();
  // const [testKudos, setTestKudos] = useState();
  const uri = localStorage.getItem('uri');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    getRockstar();
    getRockstarIncoming();
  }, []);

  function getRockstar() {
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
      setRockstar(data)
      setUser(data.name)
      setPosition(data.position)
      setNumKudos(data.numKudos)
      setUid(data.uid)
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

  function getRockstarIncoming() {
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
      // console.log(data)
      setIncoming(data)
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
        subheader="March"
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

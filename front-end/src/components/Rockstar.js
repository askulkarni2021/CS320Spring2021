import React from 'react';
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
import clsx from 'clsx';


const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 250,
    flexShrink: 0,
  },
  drawerPaper: {
    variant:"elevation3",
    width: 250,
    // height: 250,
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

export default function Rockstar() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{paper: classes.drawerPaper,}}
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
            <Avatar aria-label="Rockstar" src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg" className={classes.avatar} />
          }
          title="Kianna Westervelt"
          subheader="Software Engineer"
          />
        </Card>
        <Card>
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

            </CardContent>
          </Collapse>
        </Card>
      </Drawer>
    </div>
  );
}

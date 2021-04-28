import React from 'react'
import {Grid, Card, CardContent, Typography, CardActions, Chip, Avatar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Reactions from './Reactions';

const useStyles = makeStyles({
    root: {
      display: 'flex',
    },
    recv: {
// <<<<<<< reactions
//       display:'inline',
//       color:'#a1a1a1',
//       marginRight:'5px',
//       paddingLeft: '2px',
//       paddingRight: '2px',
// =======
        display:'inline',
        backgroundColor:'#F2F2F2',
        color:'#616161',
        marginRight:'5px',
        paddingLeft: '2px',
        paddingRight: '2px',
// >>>>>>> main
    },
});

const Accordion = withStyles({
    root: {
      border: 0,
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  })(MuiAccordion);

  const AccordionSummary = withStyles({
    root: {
      backgroundColor: 'none',
      borderBottom: 0,
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  })(MuiAccordionSummary);

  const AccordionDetails = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiAccordionDetails);

//to, from, message, tags, kudoID, kudoReactions, compReactions
export default function Kudo(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return(
        <Card className={classes.root} style={{width: '600px', margin: '10px'}}>
            <CardContent style={{padding:'5px', width: '100%'}}>
                <Accordion square expanded={expanded === 'panel'} onChange={handleChange('panel')}>
                    <AccordionSummary
                    aria-controls="panelbh-content"
                    id="panelbh-header"
                    >
                        <Grid container>
                            <Grid item>
                                <Avatar alt="Remy Sharp" src={props.avatar} style={{ height: '70px', width: '70px', marginRight: '10px'}} />
                            </Grid>
                            <Grid item>
                                <div>
                                    <Typography variant="h6" style={{display:'inline', marginRight:'5px'}}>{props.to}</Typography>
                                    <Typography variant="subtitle1" className={classes.recv}>
                                        received kudos from
                                    </Typography>
                                    <Typography style={{display:'inline'}}>{props.from}</Typography>

                                </div>
                                <CardActions>
                                    {props.tags ? props.tags.map((tag, index) => {
                                        return <Chip key={index} label={tag.value} style={{backgroundColor: tag.color}}/>
                                    }) : null}
                                </CardActions>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid>
                            <Typography variant="body2" component="p">
                                {props.message}
                            </Typography>
                        </Grid>
                    </AccordionDetails>
                    <AccordionDetails>
                      <Grid container justify='flex-end'>
                        <Typography variant="body2" component="p">
                            {props.timestamp}
                        </Typography>
                      </Grid>
                    </AccordionDetails>
                </Accordion>
                <Reactions kudoID={props.kudoID} kudoReactions={props.kudoReactions} compReactions={props.compReactions}/>
            </CardContent>
        </Card>
    )
}

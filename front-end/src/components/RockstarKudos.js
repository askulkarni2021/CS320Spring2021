import React from 'react'
import {Grid, Card, CardContent, Typography, CardActions, Chip, Avatar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';


const useStyles = makeStyles({
    root: {
      display: 'flex',
    },
    recv: {
        display:'inline',
        backgroundColor:'#F2F2F2',
        color:'#616161',
        marginRight:'5px',
        paddingLeft: '2px',
        paddingRight: '2px',
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
        <Card className={classes.root} style={{width: '180px', margin: '10px'}}>
            <CardContent style={{padding:'5px', maxWidth: '180px'}}>
                <Accordion square expanded={expanded === 'panel'} onChange={handleChange('panel')}>
                    <AccordionSummary
                    aria-controls="panelbh-content"
                    id="panelbh-header"
                    >
                        <Grid container>
                            <Grid item>
                                <Avatar alt="Remy Sharp" style={{ height: '40px', width: '40px', marginRight: '10px'}} />
                            </Grid>
                            <Grid item>
                                <div>
                                    <Typography variant="body1" style={{marginRight:'2px'}}>{props.to}</Typography>
                                    <Typography variant="body2" className={classes.recv}>
                                        received kudos from
                                    </Typography>
                                    {props.from}
                                </div>

                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid>
                            <CardActions style={{ display: 'flex', flexWrap:'wrap'}}>
                                {props.tags ? props.tags.map((tag, index) => {
                                    return <Chip key={index} label={tag.value} style={{backgroundColor: tag.color, margin: '2px'}}/>
                                }) : null}
                            </CardActions>
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
            </CardContent>
        </Card>
    )
}

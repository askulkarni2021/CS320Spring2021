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

export default function Kudo(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return(
        <Card className={classes.root} style={{width: '600px', margin: '10px'}}>
            <CardContent style={{padding:'5px'}}>
                <Accordion square expanded={expanded === 'panel'} onChange={handleChange('panel')}>
                    <AccordionSummary
                    aria-controls="panelbh-content"
                    id="panelbh-header"
                    >
                        <Grid container>
                            <Grid item>
                                <Avatar alt="Remy Sharp" style={{ height: '70px', width: '70px', marginRight: '10px'}} />
                            </Grid>
                            <Grid item>
                                <div>
                                    <Typography variant="h6" style={{display:'inline', marginRight:'5px'}}>{props.to}</Typography>
                                    <Typography variant="subtitle" className={classes.recv}>
                                        received kudos from
                                    </Typography>
                                    {props.from}
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
                </Accordion>
            </CardContent>
        </Card>
    )
}
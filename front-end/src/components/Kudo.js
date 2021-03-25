import React from 'react'
import {Grid, Card, CardContent, Typography, CardActions, Button, Avatar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';


const useStyles = makeStyles({
    root: {
      display: 'flex',
    },
    title: {
      fontSize: 14,
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
    const classes = useStyles;
    const [expanded, setExpanded] = React.useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return(
        <Card className={classes.root} style={{width: '600px', margin: '10px'}}>
            <CardContent>
                <Accordion square expanded={expanded === 'panel'} onChange={handleChange('panel')}>
                    <AccordionSummary
                        aria-controls="panelbh-content"
                        id="panelbh-header"
                        >
                        <Grid style={{width: '550px'}} container spacing={12}>
                            <Grid item xs={2} style={{paddingLeft: '10px'}}>
                                <Avatar alt="Remy Sharp" style={{ height: '70px', width: '70px'}} />
                            </Grid>
                            <Grid item xs={10}>
                                <Typography
                                    className={classes.title}
                                    color="textSecondary"
                                    gutterBottom
                                >
                                <b>{props.to}</b> received kudos from {props.from}
                                </Typography>
                                <CardActions>
                                    <Button size="small" variant="contained" color="secondary">Team Player</Button>
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
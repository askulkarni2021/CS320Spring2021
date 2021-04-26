import React from 'react'
import {Grid, Card, CardContent, Typography, CardActions, Chip, Avatar, Modal, Icon} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Reactions from './Reactions';
import ReportModal from './ReportModal';
import { useState } from 'react'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles({
    root: {
      display: 'flex',
    },
    recv: {
      display:'inline',
      color:'#A1A1A1',
      marginRight:'5px', 
      paddingLeft: '2px',
      paddingRight: '2px',
    }, 
    modalCenter: {
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      outline: '0',
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
    const [expanded, setExpanded] = useState(false);
    const [showReport, toggleShowReport] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return(
      <div>
        <Modal
          open={showReport}
          onClose={() => toggleShowReport(false)}
          aria-labelledby="report-modal"
          aria-describedby="report-kudo"
        >
          <div className={classes.modalCenter}>
            <ReportModal kid={props.kudoID} toggleShowReport={toggleShowReport}/>
          </div>
        </Modal>
        <Card className={classes.root} style={{width: '600px', margin: '10px'}}>
            <CardContent style={{padding:'5px', width: '100%'}}>
                <MoreHorizIcon onClick={() => toggleShowReport(true)}/>
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
      </div>
    )
}

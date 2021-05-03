import { Button, Card, CardContent, TextField, Grid, withStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import red from "@material-ui/core/colors/red"
import PropTypes from 'prop-types'

const styles = theme => ({
    contained: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        "&:hover": {
            backgroundColor: red[700],
            "@media (hover: none)": {
                backgroundColor: red[500]
            }
        }
    }
})

// props: classes, kid={props.kudoID}, toggleShowReport={toggleShowReport}
function ReportModal(props) {
    const { classes, kid, toggleShowReport, toggleShowSuccess } = props;
    const [reason, updateReason] = useState('')
    
    function handleSumbit() {
        const uri = localStorage.getItem('uri');
        const uid = JSON.parse(localStorage.getItem('data')).uid
        fetch('http://localhost:5000/api/data/report_kudo',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri, uid, kid, reason})
        })
        .then(response => {
            if (toggleShowReport) {
                toggleShowReport(false);
                toggleShowSuccess(true);
            }
        });
        updateReason('');
    }

    return (
        <Card style={{width: '600px', margin: '10px'}} elevation={0}>
            <CardContent>
                <form onSubmit={(e) => {e.preventDefault(); handleSumbit();}}>
                    <Grid
                     container
                     direction="column"
                     justify="space-evenly"
                     alignItems="stretch"
                     spacing={1}
                     >
                        <Grid item>
                            <TextField
                                required
                                label='Report Reason'
                                variant='outlined'
                                multiline
                                rows={4}
                                value={reason}
                                fullWidth
                                onChange={(e) => updateReason(e.target.value)}
                            />
                        </Grid>
                        <Grid item container justify='flex-end'>
                            <Button type="submit" className={classes.contained}>Submit Report</Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}

ReportModal.propTypes = {
    classes: PropTypes.object.isRequired,
    kid: PropTypes.string.isRequired,
    toggleShowReport: PropTypes.func.isRequired,
    toggleShowSuccess: PropTypes.func.isRequired,
};

export default withStyles(styles)(ReportModal)
import { Button, Card, CardContent, TextField, Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

// props: uir, uid, kudo_id
export default function ReportModal(props) {
    // need uri, to, from, message
    const [reason, updateReason] = useState('')
    

    function handleSumbit() {
        const uri = localStorage.getItem('uri');
        const uid = JSON.parse(localStorage.getItem('data')).uid
        const kid = props.kid
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
            if (props.toggleShowReport) {
                props.toggleShowReport(false);
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
                            <Button type="submit" variant="contained" styles={{backgroundColor: '#FF0000'}}>Submit Report</Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}
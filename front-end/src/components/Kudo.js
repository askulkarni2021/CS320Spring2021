import React from 'react'
import {Grid, Card, CardContent, Typography, CardActions, Button, Avatar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      display: 'flex',
    },
    title: {
      fontSize: 14,
    },
});

export default function Kudo(props) {
    const classes = useStyles;

    return(
        <Card className={classes.root} style={{width: '600px', margin: '10px'}}>
            <CardContent>
                <Grid style={{width: '550px'}} container spacing={12}>
                    <Grid item xs={2} style={{paddingLeft: '20px'}}>
                        <Avatar alt="Remy Sharp" style={{ height: '55px', width: '55px'}} />
                    </Grid>
                    <Grid item xs={10}>
                                <Typography
                                    className={classes.title}
                                    color="textSecondary"
                                    gutterBottom
                                >
                                    <b>{props.to}</b> received kudos from {props.from}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {props.message}
                                </Typography>
                            <CardActions>
                                <Button size="small" variant="contained" color="secondary">Team Player</Button>
                            </CardActions>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
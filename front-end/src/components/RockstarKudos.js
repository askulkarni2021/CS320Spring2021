import React from 'react'
import {Grid, Card, CardContent, Typography, CardActions, Button} from '@material-ui/core'
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
        <Grid
        item
        style={{width: '180px', margin: '5px'}}>
        <Card className={classes.root}>
            <CardContent>
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
            </CardContent>
            <CardActions>
                <Button size="small" variant="contained" color="secondary">Team Player</Button>
            </CardActions>
        </Card>
        </Grid>
    )
}
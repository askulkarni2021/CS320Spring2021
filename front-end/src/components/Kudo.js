import React from 'react'
import {Grid, Card, CardContent, Typography, CardActions, Chip} from '@material-ui/core'
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
        style={{width: '600px', margin: '10px'}}>
        <Card className={classes.root} elevation={3}>
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
                {props.tags ? props.tags.map((tag, index) => {
                    const colors = ['#FF0000', '#FF6600', '#0000FF']
                    return <Chip key={index} label={tag} style={{backgroundColor:colors[index]}}/>
                }) : null}
            </CardActions>
        </Card>
        </Grid>
    )
}
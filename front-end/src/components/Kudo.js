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
                {props.tags ? props.tags.map((tag, index) => {
                    return <Chip key={index} label={tag} color="primary"/>
                }) : null}
            </CardActions>
        </Card>
        </Grid>
    )
}
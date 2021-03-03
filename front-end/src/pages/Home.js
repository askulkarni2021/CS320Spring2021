import React, { Component } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActions
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';


 

const useStyles = makeStyles({
    root: {
      minWidth: 1000,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });



  
class Home extends Component {
  
    getKudos (){
        const uri = 'outback-tech';
        const formData = {uri}; 
        console.log(formData);
        fetch('http://localhost:5000/api/data/uid_map_name',
          {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          })
          .then(response => response.json()).then(data => {
            
            this.setState({employees: data});
    
          });
    
          fetch('http://localhost:5000/api/all_kudos',
          {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          })
          .then(response => response.json()).then(data => {
            
            
            this.setState({kudos: data});
    
          });
    
      }
  
  constructor(props) {
    super(props);
    // props contains the passed in data
    // to access the uid for exampled: this.props.uid
    this.state = {
      employees : {},
      kudos : []
    };
  }

  componentDidMount(){
      this.getKudos();

  }

  componentDidUpdate(){
    console.log(this.state.employees[1]);

    if(this.state.employees[1]){
        console.log(this.state.employees[1].name)
    }
  }

  kudo_(to, from, message) {
      return(
        <Grid
        item
        spacing={10}
        style={{maxWidth: '20%', margin: '10px'}}>
        <Card className={useStyles.root}>
          <CardContent>
            <Typography
              className={useStyles.title}
              color="textSecondary"
              gutterBottom
            >
              <b>{to}</b> received kudos from {from}
            </Typography>
            <Typography variant="body2" component="p">
              {message}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="contained" color="secondary">Team Player</Button>
          </CardActions>
        </Card>
        </Grid>
      )
  }

  render() {
    

    return (

      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
        
      >
          {this.state.kudos && this.state.employees[5] ? this.state.kudos.map(kudo => {
              console.log(this.state.employees[kudo.from].name)
              return this.kudo_(this.state.employees[kudo.to].name, this.state.employees[kudo.from].name, kudo.kudo)
              //console.log(kudo.from);
              //console.log(this.state.employees[1].name)
              //console.log(this.state.employees[kudo.from])
          }) : 'loading'  }

      </Grid>
    );
  }
}

export default Home;

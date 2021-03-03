import React, { Component } from "react";
import {
  Button,
  Grid,
  // TextField,
  Typography,
  // FormControl,
  // InputLabel,
  // OutlinedInput,
  // InputAdornment,
  // IconButton,
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
  constructor(props) {
    super(props);
    // props contains the passed in data
    // to access the uid for exampled: this.props.uid
    this.state = {
      company: '',
      employees : {},
      kudos : []
    };
  }

  componentDidMount(){
      this.getKudos();
      console.log('home did mount', this.props)
      const companies = {
        'starship-entertainment': 'Starship Entertainment',
        'outback-tech': 'Outback Technology',
        'greenlife-consulting': 'Greenlife Consulting'
      }
      this.setState({ company: companies[this.props.uri]});
  }

  // componentDidUpdate(){
  //   console.log(this.state.employees[1]);

  //   if(this.state.employees[1]){
  //       console.log(this.state.employees[1].name)
  //   }
  // }
  
  getKudos() {
    const uri = this.props.uri
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

  kudo_(to, from, message, key) {
      return(
        <Grid
        item
        style={{width: '20%', margin: '10px'}}
        key={key}>
        <Card className={useStyles.root} key={key}>
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
      <div>
        <Typography variant="h4" style={{margin: '20px'}}> {this.state.company} </Typography>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: "100vh" }}
          
        >
          {this.state.kudos && this.state.employees[5] ? this.state.kudos.map((kudo, index) => {
              // console.log(this.state.employees[kudo.from].name)
              return this.kudo_(this.state.employees[kudo.to].name, this.state.employees[kudo.from].name, kudo.kudo, index)
              //console.log(kudo.from);
              //console.log(this.state.employees[1].name)
              //console.log(this.state.employees[kudo.from])
          }) : 'loading'  }
        </Grid>
      </div>
    );
  }
}

export default Home;

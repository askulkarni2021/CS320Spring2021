import React, { Component } from 'react';
import { Button, Grid, TextField, Typography, FormControl, InputLabel,
OutlinedInput, InputAdornment, IconButton } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import Emoji from '../components/Emoji'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user: '',
        pass: '',
        showPass: false,
        invalidLogin: false,
    }
  }

  handleChange = (prop) => (event) => {
    this.setState({ [prop]: event.target.value });
    this.setState({invalidLogin: false})
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  handleSubmit() {
    const email = this.state.user;
    const pass = this.state.pass
    let company = email.split('@')[1].split('.')[0]
    const companies = {
      'starshipentertainment': 'starship-entertainment',
      'outbacktechnology': 'outback-tech',
      'greenlifeconsulting': 'greenlife-consulting'
    }
    const uri = companies[company]
    const formData = {email, pass, uri}; 
    console.log(formData)
    fetch('http://localhost:5000/api/verify',
      {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json()).then(data => {
        if(data.found) {
            //do stuff with data.uid
            //do stuff with data.employees (map of employee name and uid)
            //do stuff with company
            this.props.getDataFromLogin(data);
        } else {
            this.setState({invalidLogin: true})
        }
      });
  }

  render() {
    return (
      <Grid container direction="column" justify="center" alignItems="center" style={{ minHeight: '100vh'}}>
        <Grid item xs={12} sm={6} md={3} style={{padding: '10px', width: '80%'}}>
            <Typography variant="h3">
              <Emoji symbol="🙌"/> 
              Kudos
            </Typography>
            <form onSubmit={(e) => {e.preventDefault(); this.handleSubmit();}} style={{display: 'flex', flexDirection: 'column'}}>
              <TextField label="username"
                error={this.state.invalidLogin}
                variant="outlined"
                margin="normal"
                value={this.state.user}
                fullWidth
                onChange={this.handleChange('user')}
              />
              <FormControl variant="outlined" error={this.state.invalidLogin}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.pass}
                  onChange={this.handleChange("pass")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => this.handleClickShowPassword()}
                        onMouseDown={(e) => this.handleMouseDownPassword(e)}
                        edge="end"
                      >
                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
              <div style={{height: 20}}/>
              <Grid container justify="space-between" alignItems="center">
                <Button type="submit" variant="contained" color="primary" style={{maxWidth: '150px'}} disabled={this.state.invalidLogin} fullWidth>
                  Log In
                </Button>
                {this.state.invalidLogin ? <Typography variant="caption" display="block" color="error"> username or password is incorrect </Typography> : null}
              </Grid>
            </form>
        </Grid>
      </Grid>
    );
  }
}

export default Login;

import React, { useState } from 'react';
import { Button, Grid, TextField, Typography, FormControl, InputLabel,
OutlinedInput, InputAdornment, IconButton } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import logo from '../kudos_logo.png'

export default function Login(props) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);

  // updates either user state or pass state when typed
  const handleChange = (prop) => (event) => {
    if (prop === 'user') {
      setUser(event.target.value);
    } else {
      setPass(event.target.value);
    }
    setInvalidLogin(false);
  };

  // turns showPass to True or False when eye is clicked
  const handleClickShowPassword = () => {
    setShowPass(!showPass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  // main function when user submits, handles api requests
  function handleSubmit() {
    const email = user;
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
          props.setDataFromLogin(data, uri);
        } else {
          setInvalidLogin(true);
        }
      });
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center" style={{ minHeight: '100vh'}}>
      <Grid item xs={12} sm={6} md={3} style={{padding: '10px', width: '80%'}}>
          <img className="img-responsive" src={logo} alt="logo"/>
          <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}} style={{display: 'flex', flexDirection: 'column'}}>
            <TextField label="username"
              error={invalidLogin}
              variant="outlined"
              margin="normal"
              value={user}
              fullWidth
              onChange={handleChange('user')}
            />
            <FormControl variant="outlined" error={invalidLogin}>
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPass ? "text" : "password"}
                value={pass}
                onChange={handleChange("pass")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword()}
                      onMouseDown={(e) => handleMouseDownPassword(e)}
                      edge="end"
                    >
                      {showPass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
            <div style={{height: 20}}/>
            <Grid container justify="space-between" alignItems="center">
              <Button type="submit" variant="contained" color="primary" style={{maxWidth: '150px'}} disabled={invalidLogin} fullWidth>
                Log In
              </Button>
              {invalidLogin ? <Typography variant="caption" display="block" color="error"> username or password is incorrect </Typography> : null}
            </Grid>
          </form>
      </Grid>
    </Grid>
  );
}

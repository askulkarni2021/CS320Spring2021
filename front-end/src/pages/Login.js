import React, { useState } from 'react';
import { Button, Grid, TextField, Typography, FormControl, InputLabel,
OutlinedInput, InputAdornment, IconButton } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import Emoji from '../components/Emoji'

function Login() {
  const [values, setValues] = useState({
    user: '',
    pass: '',
    showPass: false,
  })

  function handleSubmit() {
    const email = values.user;
    const pass = values.pass;
    const formData = {email, pass};
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
        if(!data) {
            window.location = '/home';
        } else {
            console.log(data);
        }
       });
  }

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center" style={{ minHeight: '100vh'}}>
      <Grid item xs={12} sm={6} md={3} style={{padding: '10px', width: '80%'}}>
          <Typography variant="h3">
            <Emoji symbol="🙌"/> 
            Kudos
          </Typography>
          <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}} style={{display: 'flex', flexDirection: 'column'}}>
            <TextField label="username"
              variant="outlined"
              margin="normal"
              value={values.user}
              fullWidth
              onChange={handleChange('user')}
            />
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.pass}
                onChange={handleChange("pass")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
            <div style={{height: 20}}/>
            <Button type="submit" variant="contained" color="primary" style={{maxWidth: '150px'}}>
              Log In
            </Button>
          </form>
      </Grid>
    </Grid>
  );
}

export default Login;

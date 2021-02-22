import React, { Component } from 'react';
import './App.css';
// import Form from 'react-bootstrap/Form';
// import Col from 'react-bootstrap/Col';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Button from 'react-bootstrap/Button';
// import 'bootstrap/dist/css/bootstrap.css';
import { Container, Typography } from '@material-ui/core'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username:"",
      password:"",
      status:false
    };
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.state[name] = value;
    // this.setState({
    //   formData
    // });
  }
  triggerAPIResponse = (data) => {
    console.log(data)
    this.state.status = data;
    if (this.state.status.found=== false){
      console.log("Wrong login attempt");
    }
    else{
      console.log("Login Succesfull")
    }
  }
  handlePredictClick = (event) => {
    console.log(this.state.username)
    let email = this.state.username;
    let password = this.state.password;
    const formData = {email,password};
    this.setState({ isLoading: true });
    // debugger;
    // debugger;
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
        this.triggerAPIResponse(data);
        // this.setState({
        //   result: JSON.stringify(data),
        //   isLoading: false
        // });
       });
  }

  render() {
    const isLoading = this.state.isLoading;
    const result = this.state.result;


    return (
      <Container>
        <Typography variant="h1">Welcome to Kuds</Typography>
        <form>
          
        </form>
      </Container>
      // <Container>
      //   <div>
      //     <h1 className="title">Welcome to Kudos</h1>
      //   </div>
      //   <div className="content">
      //     <Form>
      //       <Form.Row>
      //         <Form.Group as={Col}>
      //           <Form.Label>Username:</Form.Label>
      //           <Form.Control
      //             type="text"
      //             placeholder="email"
      //             name="username"
      //             onChange={this.handleChange} />
      //         </Form.Group>
      //       <Form.Group as={Col}>
      //           <Form.Label>Password</Form.Label>
      //           <Form.Control
      //             type="text"
      //             placeholder="password"
      //             name="password"
      //             onChange={this.handleChange} />
      //         </Form.Group>
              
      //       </Form.Row>
      //       <Row>
      //         <Col>
      //           <Button
      //             block
      //             variant="success"
      //             disabled={isLoading}
      //             onClick={!isLoading ? this.handlePredictClick : null}>
      //             { isLoading ? 'Logging In' : 'Login' }
      //           </Button>
      //         </Col>
      //       </Row>
      //     </Form>
      //   </div>
      // </Container>
    );
  }
}

export default App;

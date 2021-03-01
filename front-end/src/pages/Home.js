import React, { Component } from 'react'

class Home extends Component {
    constructor(props) {
        super(props);
        // props contains the passed in data
        // to access the uid for exampled: this.props.uid
        this.state = {
            // state goes here
        }
    }
    
    render() {
        return(
            "home"
        )
    }
}

export default Home;
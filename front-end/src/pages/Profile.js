import React, { Component } from 'react'

class Profile extends Component {
    constructor(props) {
        super(props);
        // props contains the passed in data
        // to access the uid for exampled: this.props.uid
        this.state = {
            // state goes here
        }
    }

    componentDidMount() {
        //IT WORKS
        console.log(this.props.getData());
    }
    
    render() {
        return(
            "Profile"
        )
    }
}

export default Profile;
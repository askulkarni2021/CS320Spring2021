import { Button, Card, CardContent, Chip, TextField, Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

// props: getKudos, optional: toggleShowAddKudos
export default function ChangeAvatar(props) {
    // need uri, to, from, message
    const [avatars, setAvatars] = useState([]);
    // const avatarArray = [props.pic1, props.pic2];

    function av_array(){
        const uri = localStorage.getItem('uri');
        fetch('http://localhost:5000/api/get_all_avatars',
        {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({uri})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setAvatars(data);
        });
    }

    function change_avatar(im) {
      const uri = localStorage.getItem('uri');
      const uid = props.uid;
      const avatar = im;
      const formData = {uri, uid, avatar};
      fetch('http://localhost:5000/api/change_avatar',
      {
          method: 'POST',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
          console.log(formData);
      });
    }

    useEffect(() => {
        av_array()
    }, []);

    const imageMapper = avatars.map((image, index) => {
        return (
            <img src={image}
                onClick={() => {props.handleSubmitAvatar(image); change_avatar(image);}}
                style={{height: '60px', width: '80px', marginRight: '20px',}}
            />
        );
    })
    return (
        <Card style={{width: '600px', margin: '10px'}} elevation={0}>
            <CardContent>
                <Grid>
                    {imageMapper}
                    <Grid item container justify='flex-end'>
                        <Button type="submit" variant="contained" color="primary"
                        onClick={() => props.closeAvatarModal()}>Change Avatar</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

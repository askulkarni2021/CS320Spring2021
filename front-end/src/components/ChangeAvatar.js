import { Button, Card, CardContent, Chip, TextField, Grid, Typography, Avatar } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

// props: getKudos, optional: toggleShowAddKudos
export default function ChangeAvatar(props) {
    // need uri, to, from, message
    const [avatars, setAvatars] = useState([]);
    const [avatar, setAvatar] = useState('');
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
          console.log(data);
          if(data){
            props.reloadEmp()
          }
      });
    }

    function handleClickSubmit(newAvatar){
        change_avatar(newAvatar);
        props.closeAvatarModal();
    }

    const handleChangeAvatar = (newAvatar) => {
        setAvatar(newAvatar);
    };

    useEffect(() => {
        av_array();
        setAvatar(props.avatar);
    }, []);

    const imageMapper = avatars.map((image, index) => {
        return (
            <img src={image}
                onClick={() => {handleChangeAvatar(image);}}
                style={{height: '60px', width: '80px', marginRight: '20px',}}
                key={index}
            />
        );
    })

    return (
        <Card style={{width: '600px', margin: '10px'}} elevation={0}>
            <CardContent>
                <Grid item container justify='center' alignItems='center' style={{marginBottom: '10px',}}>
                    <Avatar alt="Remy Sharp"
                        style={{ height: '150px', width: '150px', marginLeft: '10px',}}
                        src={avatar}
                    />
                </Grid>

                <Typography>Your options:</Typography>
                <Grid>
                    {imageMapper}
                    <Grid item container justify='flex-end'>
                        <Button type="submit" variant="contained" color="primary"
                        onClick={() => {handleClickSubmit(avatar)}}>Change Avatar</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

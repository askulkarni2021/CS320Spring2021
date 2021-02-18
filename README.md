# Kudos

### How to get this running on your local machine:

**Front-End setup**

Navigate to front-end by doing ```cd front-end``` and then run the following command:

``` npm i``` 

This installs all required dependencies to run the react app locally in your machine. After this you should be able to run the following command:

```npm start```

This should start a react app on your machine. This run on the 3000 port of the local host and you can have only 1 react app running at a time on a certain host.

**Back-End setup**

For the backend, we need to keep a node.js api running thta listens on a certain port. Our code listens to port 5000 of local host by default. You need to navigate to the repository root folder and you can get the api running by the following command:

``` node cs320.js```

This gets your API running on the specified port and should be able to take in requests from the React frontend. 

Both things need to be running on your local host for this to work. 

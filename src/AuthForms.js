import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import AlertDismissibleExample from './AlertDismissibleExample'
import './reactpick.css';


const AuthForms = ({ logout, handlePostedby }) => {
  const [show, setShow] = useState(false);
 
  console.log("meees", logout);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [validated, setValidated] = useState(false);


  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log("loggedinUser", loggedInUser);
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const handleSubmit = async e => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
    if (form.checkValidity() === true) {

    e.preventDefault();
    const user = { email: username, password: password };

    // send the username and password to the server
    const response = await axios.post(
      "/api/login",
      user
    );
    console.log("login", response.data)
    if (response.data.isAuth === true) {
      // set the state of the user
      setUser(response.data)
      // store the user in localStorage

      localStorage.setItem('user', JSON.stringify(response.data))
    }else
    setShow(true);

    console.log(response.data)
  }

  };



  const handleLogout = async (e) => {

    console.log("handlelogout ");
    setUser({});
    setUsername("");
    setPassword("");
    localStorage.clear();
    const result = await axios.get(
      "/api/logout"
    );
    e.preventDefault();
  };

  /*if(logout){
      console.log("if condition");
      handleLogout();
      console.log("after handle logout if condition");
      return <Redirect push to="/"/>  
  }*/


  // if there's a user show the message below

  if (typeof user != 'undefined' && user != null && typeof user.isAuth != 'undefined') {
    if (user.isAuth === true) {

      handlePostedby(user.username);
      return <Redirect push to="/" />

        ;
    }
    else {
      setUser(null);

      setShow(true);
      

    }

    // color is undefined
  }





  // if there's no user, show the login form
  return (
    <div className="container-lg myborder">
        <div className="col-md-6 offset-md-3">
    <div>
      <div>
      </div>
      <AlertDismissibleExample show={show} setShow={setShow} />

      <Form className="align-items-center" noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="username" >
          <Form.Label>Username</Form.Label>


              <Form.Control
                type="text"
                name="username"
                value={username}
                placeholder="enter a username"
                required
                onChange={({ target }) => setUsername(target.value)}
              />
              <Form.Control.Feedback type="invalid">
            Please provide a valid username.
          </Form.Control.Feedback>
       
          </Form.Group>
       

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            placeholder="Enter a password"
            required
            onChange={({ target }) => setPassword(target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password
          </Form.Control.Feedback>
        </Form.Group>






        <Button variant="primary" type="submit">
          Submit
    </Button>
      </Form>
    </div>
    </div>
    </div>
  );
};

export default AuthForms;

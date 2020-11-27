import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';

const AuthForms = ({logout, handlePostedby}) => {
    console.log("meees",logout);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();
  const [redirect, setRedirect] = useState(false);


  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log("loggedinUser",loggedInUser);
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const user = { email: username, password: password };

    // send the username and password to the server
    const response = await axios.post(
      "/api/login",
      user
    );
    console.log("login", response.data)
    // set the state of the user
    setUser(response.data)
    // store the user in localStorage
    localStorage.setItem('user', JSON.stringify(response.data))
    console.log(response.data)
    
  };

  
  const handleLogout = async (e)  => {
    
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
  if (user) {
    handlePostedby(user.username);
     return <Redirect push to="/"/>  
    
    ;
  }

  // if there's no user, show the login form
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username: </label>
      <input
        type="text"
        value={username}
        placeholder="enter a username"
        onChange={({ target }) => setUsername(target.value)}
      />
      <div>
        <label htmlFor="password">password: </label>
        <input
          type="password"
          value={password}
          placeholder="enter a password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default AuthForms;

import React from "react";


const AuthForms = () => {

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

  
  const handleLogout = async e => {
    setUser({});
    setUsername("");
    setPassword("");
    localStorage.clear();
    const result = await axios.get(
        "/api/logout"
      );

  };


// if there's a user show the message below
  if (user) {
    return <div><div>{user.username} is loggged in</div>
    <div><button onClick={handleLogout}>logout</button></div>
    </div>
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
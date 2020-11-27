import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import axios from 'axios';





 





const Signup = ({handlePostedby}) => {

    const [redirect, setRedirect] = useState(false);

    const [result, setResult] = useState(null);
    const [state, setState] = useState({
        firstname: '',
        email: '',
        password: ''
       
        
    });

    const sendEmail = event => {
       
      
      
       
        event.preventDefault();
        axios
        .post('/api/register',{ ...state })
        .then(response => {
            handlePostedby(response.data.user.firstname);
            setResult(response.data);
            
            setRedirect(true);
            console.log("resp: ",response.data);
           
            setState({ firstname: '', email: '', password: ''});
     
            
        })
        .catch( () => {
            setResult({ sucess: false, message: 'something went wrong. try again'});
        });
    
        // code to trigger Sending email
      };
    
      const onInputChange = event => {
        console.log("submit form ", event.target)
        const { name, value } = event.target;
    
        setState({
          ...state,
          [name]: value
        });
      };

     

    
    return (
      <div>
      
      { redirect ? (<Redirect push to="/"/>) : null } 
      
      <form onSubmit={sendEmail}>
        <Form.Group controlId="firstname">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="firstname"
            value={state.firstname}
            placeholder="name"
            onChange={onInputChange}
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={state.email}
            placeholder="email"
            onChange={onInputChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={state.password}
            placeholder="Enter new password"
            onChange={onInputChange}
          />
        </Form.Group>
      
           
           
            
            
       
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
    
  );
};


export default Signup;
   

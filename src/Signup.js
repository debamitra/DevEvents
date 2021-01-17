import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import AlertDismissibleExample from './AlertDismissibleExample'
import './reactpick.css';











const Signup = ({ handlePostedby }) => {
  const [show, setShow] = useState(false);

  const [msg, setMsg] = useState(null);

  console.log("mes signup:",msg);

  const [redirect, setRedirect] = useState(false);

  const [result, setResult] = useState(null);
  const [state, setState] = useState({
    firstname: '',
    email: '',
    password: ''


  });

  const [validated, setValidated] = useState(false);

  const sendEmail = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    if (form.checkValidity() === true) {

      event.preventDefault();
      axios
        .post('/api/register', { ...state })
        .then(response => {
          console.log("resp signup: ", response.data);

          setResult(response.data);
          if (response.data.success === true) {
            handlePostedby(response.data.user.firstname);

            setRedirect(true);
            

            setState({ firstname: '', email: '', password: '' });
          } else {

            setShow(true);
            setMsg(response.data.message);
          }




        })
        .catch(() => {
          setResult({ sucess: false, message: 'something went wrong. try again' });
        });

    }

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
    <div className="container-lg myborder">
      <div className="col-md-6 offset-md-3">
        <div>
          <div>
          </div>
          <AlertDismissibleExample show={show} setShow={setShow} msg={msg} />

          {redirect ? (<Redirect push to="/" />) : null}

          <Form className="align-items-center" noValidate validated={validated} onSubmit={sendEmail}>
            <Form.Group controlId="firstname">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                value={state.firstname}
                placeholder="name"
                required
                onChange={onInputChange}
              />
              <Form.Control.Feedback type="invalid">
            Please provide a valid username.
          </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={state.email}
                placeholder="email"
                required
                onChange={onInputChange}
              />
              <Form.Control.Feedback type="invalid">
            Please provide a valid email
          </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={state.password}
                placeholder="Enter new password"
                required
                onChange={onInputChange}
              />
              <Form.Control.Feedback type="invalid">
            Please provide a valid password.
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


export default Signup;


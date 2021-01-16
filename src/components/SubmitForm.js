import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import styles from '../App.css';
import DateTimePicker from 'react-datetime-picker';
import 'bootstrap/dist/css/bootstrap.min.css';
import '.././submit.css';


import { InputTags } from 'react-bootstrap-tagsinput'
import 'react-bootstrap-tagsinput/dist/index.css'
import TagsInput from '../TagsInput';

















const SubmitForm = ({ postedbyuser, handleChange }) => {

  const profilename = postedbyuser != "" ? postedbyuser : "guest";
  console.log("profilename", profilename);
  const [redirect, setRedirect] = useState(false);
  const [result, setResult] = useState(null);
  const [state, setState] = useState({
    name: '',
    url: '',
    description: '',
    postedby: profilename,
    startdatetime: new Date(),
    enddatetime: new Date(),
    tags: []

  });

  const handletags = (value) =>{
    console.log("inside handle tags ",value);
    const doubled = value.map((item) => (item.text));
    setState({ ...state, tags: doubled });


  }

  const sendEmail = event => {

    event.preventDefault();
    axios
      .post('api/send', { ...state })
      .then(response => {
        setResult(response.data);
        //console.log("inside sendmail profilename", profilename);

        setRedirect(true);
        console.log("resp: ", response.data);
        const { name, url, description, startdatetime, enddatetime, postedby } = state;
        setState({ name: '', url: '', description: '', postedby: "guest", startdatetime: new Date(), enddatetime: new Date() });

        console.log("eventlist after response : ", name)
        var newList = [];
        newList.push({
          name: name, url: url, description: description, postedby: postedby, startdatetime: new Date(startdatetime).toUTCString(),
          enddatetime: new Date(enddatetime).toUTCString()
        });

        console.log("eventlist after handle change : ", newList)
        handleChange(newList);
        ;

      })
      .catch(() => {
        setResult({ sucess: false, message: 'something went wrong. try again' });
      });
  };

  const onInputChange = event => {
    console.log("submit form ", event.target)
    const { name, value } = event.target;

    setState({
      ...state,
      [name]: value
    });
  };

  const onInputStartTimeChange = event => {
    console.log("submit form ", event)
    const value = event;
    const name = 'startdatetime';

    setState({
      ...state,
      [name]: value
    });
  };

  const onInputEndTimeChange = event => {
    console.log("submit form ", event)
    const value = event;
    const name = 'enddatetime';

    setState({
      ...state,
      [name]: value
    });
  };



  return (
    <div>

      { redirect ? (<Redirect push to="/" />) : null}

      <Form noValidate onSubmit={sendEmail}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
        
            type="text"
            name="name"
            value={state.name}
            placeholder="Enter a heading"
            onChange={onInputChange}
          />
          
        </Form.Group>
        <Form.Group controlId="url">
          <div className="formsub">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              name="url"
              value={state.url}
              placeholder="Enter the url"
              onChange={onInputChange}
            />
          </div>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} name="description"
            value={state.description}
            placeholder="Enter a description"
            onChange={onInputChange} />
        </Form.Group>

        <Form.Label>Start time </Form.Label><span> : </span>
        <DateTimePicker
          name="startDate"
          onChange={onInputStartTimeChange}
          value={state.startdatetime}
        />
        <span ></span>
        <Form.Label>End time </Form.Label> <span> : </span>
        <DateTimePicker
          name="endDate"
          onChange={onInputEndTimeChange}
          value={state.enddatetime}
        />

        <div ></div>
        <Form.Label>tags </Form.Label> <span> : </span>
        {/*<div style={{ margin: 0.5 }}>
          <div className='input-group'>
            <InputTags values={state.tags} onTags={(value) => setState({ ...state, tags: value.values })} />
            <button
              className='btn btn-outline-secondary'
              type='button'
              data-testid='button-clearAll'
              onClick={() => {
                setState({ ...state, tags: [] })
              }}
            >
              Delete all
              </button>
          </div>

          <ol>
            {state.tags.map((item, index) => (
              <li key={item + index}>{item}</li>
            ))}
          </ol>
        </div>
            */}
        <TagsInput handletags={handletags} /> <span ></span>
        <div style={{ margin:10 }}></div>
       





        <div ><Button variant="primary" type="submit">
          Submit
        </Button></div>

      </Form>
    </div>

  );
};


export {
  SubmitForm
}

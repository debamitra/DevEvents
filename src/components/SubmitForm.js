import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import axios from 'axios';
import styles from '../App.css';
import DateTimePicker from 'react-datetime-picker';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '.././submit.css';


import { InputTags } from 'react-bootstrap-tagsinput'
import 'react-bootstrap-tagsinput/dist/index.css'

import TagsInput from '../TagsInput';
import moment from 'moment'




const SubmitForm = ({ postedbyuser, handleChange, taglist }) => {

  const profilename = postedbyuser != "" ? postedbyuser : "guest";
  console.log("profilename", profilename);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [dates, setDates] = useState({

    startdatetimeformatted: moment().format("YYYY-MM-DDTHH:mm"),
    enddatetimeformatted: moment().format("YYYY-MM-DDTHH:mm"),

  });
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
  console.log("timezone: ", timezone);
  console.log("in use effect submit firm: dates", taglist);



  const handletags = (value) => {
    console.log("inside handle tags ", value);
    const doubled = value.map((item) => (item.text));
    setState({ ...state, tags: doubled });


  }

  React.useEffect(() => {
    setState({
      ...state,
      startdatetime: new Date(moment(dates.startdatetimeformatted).format()),
      enddatetime: new Date(moment(dates.enddatetimeformatted).format())
    });

  }, [dates]);



  const sendEmail = event => {

    event.preventDefault();
    console.log("in use effect submit firm: state", state);

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

  const onInputTimeChange = event => {
    console.log("submit form ", event.target.value)
    const value = event.target.value;
    const name = event.target.name;

    setDates({
      ...dates,
      [name]: value
    });
  };






  return (
    <div style={{ marginBottom: 5 }} className="container-lg myborder">
      <div className="col-md-6 offset-md-3">
        <div>
          <div>
          </div>


          {redirect ? (<Redirect push to="/" />) : null}

          <Form noValidate onSubmit={sendEmail}>
            <Form.Row className="align-items-center">
              <Col>
                <Form.Group controlId="name">
                  <Form.Label>Heading</Form.Label>
                  <Form.Control

                    type="text"
                    name="name"
                    value={state.name}
                    placeholder="Enter a heading"
                    onChange={onInputChange}
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Form.Group controlId="url">

                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="url"
                    value={state.url}
                    placeholder="Enter the url"
                    onChange={onInputChange}
                  />

                </Form.Group>
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={2} name="description"
                    value={state.description}
                    placeholder="Enter a description"
                    onChange={onInputChange} />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Form.Group controlId="startdatetime">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control type="datetime-local" name="startdatetimeformatted" placeholder="Event start time"
                    value={dates.startdatetimeformatted}

                    onChange={onInputTimeChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="enddatetime">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control type="datetime-local" name="enddatetimeformatted" placeholder="Event end time"
                    value={dates.enddatetimeformatted}
                    onChange={onInputTimeChange}
                  />
                </Form.Group>
              </Col>

            </Form.Row>

            {/*
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
        */
            }

            <TagsInput handletags={handletags} taglist={taglist}/> <span ></span>








            <div ><Button variant="primary" type="submit">
              Submit
        </Button><span ></span></div>

          </Form>
        </div>
      </div>
    </div>

  );
};


export {
  SubmitForm
}

import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import axios from 'axios';
import styles from  '../App.css';
import DateTimePicker from 'react-datetime-picker';
import 'bootstrap/dist/css/bootstrap.min.css';
import  '.././submit.css';




 

const List = ({ list, onRemoveItem }) => 
list.map(item => (
 <Item 
  key={item.name} 
  item={item}
  onRemoveItem={onRemoveItem}
 /> 
));

const Item = ({item, onRemoveItem}) => (
  <div className="item">
  <span style={{ width: '40%' }}>
    <a href={item.url}>{item.heading}</a>
    
<span style={{ width: '30%' }}></span>start: {item.startdatetime}</span>
<span style={{ width: '30%' }}>end: {item.enddatetime}</span> 
<span style={{ width: '10%' }}>
    <button
      type="button"
      onClick={() => onRemoveItem(item)}
      className={`${styles.button} ${styles.buttonSmall}`}
    >
      Dismiss
    </button>
  </span>
</div>

);
  
  const MyList = ( {eventlist} ) => {
     
     
    return (
        
      <div>
        <List list={eventlist} />
      </div>
    );
  };

  




const SubmitForm = ({postedbyuser, handleChange}) => {
     //const [value1, onChange1] = useState(new Date())
     //const [value2, onChange2] = useState(new Date())
     const profilename = postedbyuser != "" ? postedbyuser : "guest";
     console.log("profilename",profilename);
    const [redirect, setRedirect] = useState(false);
    const [result, setResult] = useState(null);
    const [state, setState] = useState({
        name: '',
        url: '',
        postedby: profilename,
        startdatetime: new Date(),
        enddatetime:new Date()
        
    });

    const sendEmail = event => {
       
      
       console.log("value of dattime picker : ",state);
       
        event.preventDefault();
        axios
        .post('/send',{ ...state })
        .then(response => {
            setResult(response.data);
            console.log("inside sendmail profilename",profilename);
            
            setRedirect(true);
            console.log("resp: ",response.data);
            const {name,url,startdatetime, enddatetime,postedby} = state;
            setState({ name: '', url: '', postedby: "guest", startdatetime: new Date(), enddatetime:new Date()});
            
            console.log("eventlist after response : ",name)   
            var newList = [];
            newList.push({name:name, url:url, postedby: postedby, startdatetime:new Date(startdatetime).toUTCString(),
               enddatetime:new Date(enddatetime).toUTCString()});
            
            console.log("eventlist after handle change : ",newList)    
            handleChange(newList);  
                 ;
            
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
      
      { redirect ? (<Redirect push to="/"/>) : null } 
      
      <form onSubmit={sendEmail}>
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
           
           
           
            
          
       <div><Button variant="primary" type="submit">
          Submit
        </Button></div>
        
      </form>
    </div>
    
  );
};


export {
    SubmitForm,
    MyList
  }

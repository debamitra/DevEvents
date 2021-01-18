
import React, { useEffect, useState } from "react";

import {Alert, Button} from 'react-bootstrap';


const AlertDismissibleAuthError = ({show, setShow, msg}) => {
    
    if (show) {
      console.log("alert adm:",msg);
      return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            {msg}
          </p>
        </Alert>
      );
    }
    return <div></div>;
  }

  export default AlertDismissibleAuthError;
  
  
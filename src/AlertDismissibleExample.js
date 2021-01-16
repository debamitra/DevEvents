
import React, { useEffect, useState } from "react";

import {Alert, Button} from 'react-bootstrap';
const AlertDismissibleExample = ({show, setShow}) => {
    //const [show, setShow] = useState(true);
  
    if (show) {
      return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            This user does not exist!
          </p>
        </Alert>
      );
    }
    return <div></div>;
  }

  export default AlertDismissibleExample;
  
  
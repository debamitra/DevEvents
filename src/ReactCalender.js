import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ReactCalender = ({handleDateSearch}) => {
  const [value, onChange] = useState(new Date());


  return (
   <div>
     <Calendar 
        onChange={onChange}
        value={value}
      />
      {console.log("value:",value)}
       {handleDateSearch(value)}
   </div>
  );
}

export default ReactCalender;
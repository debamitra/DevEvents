import React, { useEffect, useState } from "react";
import  './App.css';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';






function Countdown({startDate}) {
  /*let date = new Date(startDate); 
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(navigator.language );
  let intlDateObj = new Intl.DateTimeFormat(navigator.language, { 
    timeZone: tz
}); */

//let usaTime = intlDateObj.format(date); 
//console.log('USA date: ' + usaTime); 
  //console.log(tz);

  const calculateTimeLeft = () => {
    let year = new Date().getFullYear();
    const difference = +new Date(startDate) - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };




  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

Object.keys(timeLeft).forEach((interval) => {
  if (!timeLeft[interval]) {
    return;
  }

  timerComponents.push(
    <span>
      {timeLeft[interval]} {interval}{" "}
    </span>
  );
});

return (
  <div>
    <label htmlFor="basic-url">
    {timerComponents.length ? <span>{timerComponents} till event starts.</span> : <span>event over.</span>}
    </label>
 </div>  
);
}

export default Countdown;
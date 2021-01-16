import React, { useState, useEffect } from 'react';
import axios from 'axios';




import TasksComponent from '.././TasksComponent';


import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        minHeight: '100vh'
    },
    content: {
        marginTop: 54
    },
    mainBlock: {
        backgroundColor: '#F7F8FC',
        padding: 30
    },cardsContainer: {
      marginRight: -30,
      marginTop: -30
  },
  cardRow: {
      marginTop: 30,
      
      '@media (max-width: 768px)': {
          marginTop: 0
      }
  },
  miniCardContainer: {
      flexGrow: 1,
      marginRight: 30,
      '@media (max-width: 768px)': {
          marginTop: 30,
          maxWidth: 'none'
      }
  },
  
  lastRow: {
      marginTop: 30,
      marginBottom: 30
  }
  });


const List = ({ list }) => (
    <Row horizontal="space-between" className={css(styles.lastRow)}
    breakpoints={{ 1024: 'column' }}>
    
    <TasksComponent containerStyles={styles.tasks} list={list} title={"Most recently posted tech events"}/>
    
    </Row>)
 
function New() {
  const [data, setData] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('api/new');
      function currentevents(story) {
        return story.postedby != 'guest' && Date.parse(new Date(story.startDate)) >= Date.parse(new Date())
      }

      

      const currEvents = (result.data).filter(currentevents);
      setData(currEvents);

      console.log("data events:",result.data);
     
    };
 
    fetchData();
    
  }, []);
 
  return (
    <div>
        <List list ={data}/>
    </div>
  );
}
 


export {
    New
}

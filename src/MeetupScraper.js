import React,{useEffect,useState} from 'react'
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';

import TasksComponent from './TasksComponent';

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




const List = ({ list}) => (
  <Row horizontal="space-between" className={css(styles.lastRow)}
  breakpoints={{ 1024: 'column' }}>
  
  <TasksComponent containerStyles={styles.tasks} list={list}/>
  
  </Row>)

const MeetupScraper = ({handleChange}) => {

 


  const [posts, setPosts]=useState([])
const getPosts = async () => {
  try {
    fetch('Output.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setPosts(myJson)
        handleChange(myJson);  
      });
    
    
      // set State
  
  } catch (err) {
    console.error(err.message);
  }
};
  
useEffect(()=>{
    
  getPosts()
  const interval=setInterval(()=>{
    getPosts()
   },100000)
     
     
   return()=>clearInterval(interval)
},[]);

return (
    <div>
       {/*<h1>useEffect</h1>
      <List 
          list={posts} 
          
       />*/}
    </div>
  );
}



export default MeetupScraper;

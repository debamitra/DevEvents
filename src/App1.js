import React, { useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';


import NameForm from './SubmitEvent'

import { Redirect } from 'react-router-dom';


import logo from './logo.svg';
import  './App.css';
import Countdown from './Countdown'
import AuthForms from './AuthForms'
import Signup from './Signup'

import TasksComponent from './TasksComponent';
import PastEventsComponent from './PastEventsComponent';
import ReactDOM from 'react-dom';
import { ReactComponent as Check } from './check.svg';

import Header from './components/Header';
import { SubmitForm, MyList } from './components/SubmitForm';

import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import SidebarComponent from './SidebarComponent';
import HeaderComponent from './HeaderComponent';



import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import txt from './Output.json';



const styles = StyleSheet.create({
  container: {
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

function Tick() {
  const element = (
    <div className="clock">

      <h4>Hello, guest ! It's {new Date().toLocaleTimeString()}.</h4>
    </div>
  );
 
  //ReactDOM.render(element, document.getElementById('time'));
}

setInterval(Tick, 1000);

const Submit = ( {postedbyuser, handleChange} ) => (
  <div className="container-submit">
    <SubmitForm postedbyuser={postedbyuser} handleChange={handleChange}/>
    
   
    
  </div>
)





const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='



const useSemiPersistentState = (key, initialState) => {
  const[value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  console.log("in semiPErsistnt");
  React.useEffect(() => { //function called called when value/key changes
    localStorage.setItem(key,value);
    console.log("in use effect in semipersistenat key:value",key,value);
  }, [value, key]);

  return [value, setValue];
};


const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
      case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };

      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        };

    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.url != story.url
        ),
      };
      
    default :
      throw new Error();
  }
};

const Logout = ({handlePostedby}) => {
  handlePostedby("");
  localStorage.clear();
  const logoutFunc = async () => {
    const result = await axios.get(
      "/api/logout"
    );

  }
  logoutFunc();
   
      console.log("in logout");
       return   <Redirect push to="/"/>  

}



const App1 = () => {

  const [postedby, setPostedby] = React.useState("");

  const handlePostedby = (user) => {
    setPostedby(user);
  }
 

  useEffect(() => {
    const loggedInUserAgain = localStorage.getItem("user");
    console.log("loggedinUser",loggedInUserAgain);
    if (loggedInUserAgain) {
      const foundUser = JSON.parse(loggedInUserAgain);
      const usern = foundUser.username;
      setPostedby(usern);
    }
  }, []);
 console.log("in ap1:",postedby);
  
  
  

  function Greeting(props) {

    const isLoggedIn = (postedby != "");
    console.log("inside greetins: ", postedby);
    if (isLoggedIn) {
      console.log("inside isloggedin: ", postedby);
      return (
        
        <Link style={{padding: 20}} to="/logout">logout</Link>
        

      );
      
    }
    else{
      console.log("inside isloggedin else: ", postedby);
      return [<Link style={{padding: 20}} to="/login">login</Link>, " | ",
    <Link style={{padding: 20}} to="/signup">signup</Link> ]
    }
  }
  

  
  const [eventlist, setEventList] = React.useState(initialList);
  const handleChange = (newValue) => {
    const newList = eventlist.concat(newValue);
 
    setEventList(newList);
    console.log("inside handle change", newValue);
  }
  const padding = {

    margin: 120
  }


  const element = (
  
    <Router>
      <Row className={css(styles.container)}>
      <SidebarComponent  />
     
      <Column flexGrow={1} className={css(styles.mainBlock)}>
      
                <HeaderComponent title={"home"} postedby={postedby} />
                <div className={css(styles.content)}>
                
            
   

    <Switch>
      <Route path="/submit">
        <Submit postedbyuser={postedby} handleChange={handleChange}/>
      </Route>
      <Route path="/login">
      <div className="container-submit">
        <AuthForms logout={false} handlePostedby={handlePostedby}/></div>
      </Route>
      <Route path="/logout">
        <Logout handlePostedby ={handlePostedby} />
      </Route>
      <Route path="/signup">
      <div className="container-submit">
        <Signup handlePostedby ={handlePostedby} /></div>
      </Route>
      <Route path="/">
        <App eventlist={eventlist}/>
      </Route>
    </Switch>
   
        </div>
        <div id="element-align">
      <i>Meetup discovery app 2020</i>
    </div>
                </Column>

    
    <SidebarComponent  />
    </Row>
  </Router>
  );
  return element;
}


// Events to add list


 

const initialList  = [
 
];


const App = ({eventlist}) =>  {

  const [pastStories,setPastStories] = React.useState([]);

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');
  console.log("in app");
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );


  const handleFetchStories = React.useCallback(async () => {

    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try{
      const result = await axios.get('/events');
      
      /////////////////////////////////////////////////////////
      console.log("result", result.data);
     
      
      function searched(story) {
        return story.name.toLowerCase().includes(searchTerm.toLowerCase())
      }

      function currentevents(story) {
        return Date.parse(new Date(story.startDate)) >= Date.parse(new Date())
      }

      function pastevents(story) {
        return Date.parse(new Date(story.startDate)) < Date.parse(new Date())
      }
      let  newresult = [];

      result.data.forEach(elem => {
        const {name, url, startdatetime, enddatetime, postedby} = elem;
        const temp = {
          name : name,
          url : url,
          postedby : postedby,
          startDate :  startdatetime + "",
          endDate : enddatetime + ""
        };
        newresult.push(temp);
      }
        );

        txt.forEach(elem => elem.postedby = 'guest' );
      
      console.log("newresult",newresult);
      const text = txt.concat(newresult);
      console.log("text",text)
      

      const currEvents = text.filter(currentevents);
      const searchedStories =  currEvents.filter(searched);
      console.log("sear:",searchedStories);

      setPastStories(text.filter(pastevents));
      


      /////////////////////////////////////////////////////////
    
          dispatchStories({
            type: 'STORIES_FETCH_SUCCESS',
            payload: searchedStories, //txt
          });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE'});
    }
    
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
    
  }, [handleFetchStories]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }
  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
    
  };

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };
  let  newresult2 = [];

      eventlist.forEach(elem => {
        const {name, url, postedby, startDate, endDate} = elem;
        const temp = {
          name : name,
          url : url,
          postedby : postedby,
          startDate :  elem.startdatetime+"",
          endDate : elem.enddatetime+""
        };
        newresult2.push(temp);
      }
        );
      
      
      //const x = stories.data.concat(newresult2);
 


  return (
  
    <div >
      <h1 className="headline-primary">
      </h1>
      
      

      
     
 

      
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        
        
        <List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory} 
        />
        
        
      )}

<h1 className="headline-primary">PAST MEETS</h1>
      <v list={pastStories}/>
      <hr></hr>
      <SearchForm searchTerm={searchTerm}
      onSearchInput={handleSearchInput}
      onSearchSubmit={handleSearchSubmit}
      />


    </div>
    
  );
};

const InputWithLabel = ({ 
  id, 
  value, 
  type = 'text', 
  onInputChange, 
  isFocused, 
  children,
 }) => {
     const inputRef = React.useRef();

     React.useEffect(() => {
       if (isFocused && inputRef.current) {
         inputRef.current.focus();
       }
     }, [isFocused]);
     
     return (
      <>
      <StyledLabel htmlFor={id} className="label">{children} </StyledLabel>
      &nbsp;
        <StyledInput ref={inputRef} 
        id ={id}
        type={type} 
        value={value} 
        onChange={onInputChange}
        className="input"
        />
      </>
  
    );
   };

   

   const PastList = ({ list, onRemoveItem }) => (
    <Row horizontal="space-between" className={css(styles.lastRow)}
    breakpoints={{ 1024: 'column' }}>
    
    <PastEventsComponent containerStyles={styles.tasks} list={list}/>
    
    </Row>)



const List = ({ list, onRemoveItem }) => (
  <Row horizontal="space-between" className={css(styles.lastRow)}
  breakpoints={{ 1024: 'column' }}>
  
  <TasksComponent containerStyles={styles.tasks} list={list}/>
  
  </Row>)
  /*list.map(item => (
    <Item 
     key={item.name} 
     item={item}
     onRemoveItem={onRemoveItem}
    /> 
   ));*/


  

  const Item = ({item, onRemoveItem}) => (
    
    <div className="item">
    <div className="sub-item1">
    
      <a href={item.url}>{item.name}</a>
    </div>
    <div className="sub-item2">
      start: {new Date(item.startDate).toUTCString()}
      <Countdown startDate={item.startDate}/>
    </div>
    
      
  

      

  </div>

  );
  


  const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
  }) => (
    <form onSubmit={onSearchSubmit} className="search-form">
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button
      type="submit"
      disabled={!searchTerm}
      className={`button button-large`}
    >
      Submit
    </button>
  </form>
  );




  const StyledContainer = styled.div`
  margin-left: 120px;
  margin-right: 120px;
 
 height : 100vw;
 padding: 20px;

 background: #f0f2f4;
 background: linear-CanvasGradient(tp ;AnimationEffect, #87CEFA, #f0f2f4);
 color: #171212;
 `;

 const StyledHeadlinePrimary = styled.h1`
 font-size: 48px;
 font-weight: 300;
 letter-spacing: 2px;
 `;
const StyledItem = styled.div`
display: flex;
align-items: center;
padding-bottom: 5px;
`;

const StyledColumn = styled.span`
 padding: 0 5px;
 white-space: nowrap;
 overflow: hidden;
 white-space: nowrap;
 text-overflow: ellipss;

 a {
   color: inherit;
 }

 width: ${props => props.width};
 `;
 const StyledButton = styled.button`
 background: transparent;
 border: 1px solid #171212;

 padding: 5px;
 cursor: pointer;

 transition: all 0.1s ease-in;

 &:hover {
   background: #171212; 
   color: #ffffff;
 }
`;
// 171212 - black    ffffff -> white
const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 5px;

  
`;
    
const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: center;
`;

const StyledLabel = styled.label `
    
    padding-left: 5px;
    font-size: 19px;
    `;

    const StyledInput = styled.input `
    border: none;
    border-bottom: 1px solid #171212;
    background-color: transperant;
    font-size: 21px;
    `;
   









export default App1;


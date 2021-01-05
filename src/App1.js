import React, { useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import './App.css';
import Countdown from './Countdown'

import AuthForms from './AuthForms'
import Signup from './Signup'

import TasksComponent from './TasksComponent';
import PastEventsComponent from './PastEventsComponent';

import { SubmitForm } from './components/SubmitForm';

import { New } from './components/New';

import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import SidebarComponent from './SidebarComponent';
import HeaderComponent from './HeaderComponent';

import "react-datepicker/dist/react-datepicker.css";

//import Select from 'react-dropdown-select';



import { InputTags } from 'react-bootstrap-tagsinput'
import 'react-bootstrap-tagsinput/dist/index.css'


import 'bootstrap/dist/css/bootstrap.css';


import 'bootstrap/dist/css/bootstrap.min.css';




import FilterSearchComponent from './FilterSearchComponent';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const Countries = [
  { label: "Albania", value: 355 },
  { label: "Argentina", value: 54 },
  { label: "Austria", value: 43 },
  { label: "Cocos Islands", value: 61 },
  { label: "Kuwait", value: 965 },
  { label: "Sweden", value: 46 },
  { label: "Venezuela", value: 58 }
];









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
  }, cardsContainer: {
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


const Submit = ({ postedbyuser, handleChange }) => (
  <div className="container-submit">
    <SubmitForm postedbyuser={postedbyuser} handleChange={handleChange} />



  </div>
)





const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='



const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  console.log("in semiPErsistnt");
  React.useEffect(() => { //function called  when value/key changes
    localStorage.setItem(key, value);
    console.log("in use effect in semipersistenat key:value", key, value);
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

    default:
      throw new Error();
  }
};

const Logout = ({ handlePostedby }) => {
  handlePostedby("");
  localStorage.clear();
  const logoutFunc = async () => {
    const result = await axios.get(
      "/api/logout"
    );

  }
  logoutFunc();

  console.log("in logout");
  return <Redirect push to="/" />

}



const App1 = () => {


  const [postedby, setPostedby] = React.useState("");

  const handlePostedby = (user) => {
    setPostedby(user);
  }


  useEffect(() => {
    const loggedInUserAgain = localStorage.getItem("user");
    if (loggedInUserAgain) {
      const foundUser = JSON.parse(loggedInUserAgain);
      const usern = foundUser.username;
      setPostedby(usern);
    }
  }, []);






  const [eventlist, setEventList] = React.useState(initialList);
  const handleChange = (newValue) => {
    const newList = eventlist.concat(newValue);

    setEventList(newList);

  }
  const padding = {

    margin: 120
  }


  const element = (

    <Router>

      <Row className={css(styles.container)}>
        <SidebarComponent />

        <Column flexGrow={1} className={css(styles.mainBlock)}>

          <HeaderComponent title={"home"} postedby={postedby} />
          <div className={css(styles.content)}>




            <Switch>
              <Route path="/new">
                <New />
              </Route>
              <Route path="/submit">
                <Submit postedbyuser={postedby} handleChange={handleChange} />
              </Route>
              <Route path="/login">
                <div className="container-submit">
                  <AuthForms logout={false} handlePostedby={handlePostedby} /></div>
              </Route>
              <Route path="/logout">
                <Logout handlePostedby={handlePostedby} />
              </Route>
              <Route path="/signup">
                <div className="container-submit">
                  <Signup handlePostedby={handlePostedby} /></div>
              </Route>
              <Route path="/">
                <App eventlist={eventlist} handleChange={handleChange} />
              </Route>
            </Switch>

          </div>
          <div id="element-align">
            <i>Meetup discovery app 2020</i>
          </div>
        </Column>


        <SidebarComponent />
      </Row>
    </Router>
  );
  return element;
}


const initialList = [];


const App = ({ eventlist, handleChange }) => {
  //const [tags, setTags] = React.useState([]);
  const [sortBy, setSortBy] = React.useState({ label: "upcoming events", value: 46 });


  const [searchDate, setSearchDate] = React.useState(new Date());
  const [pastStories, setPastStories] = React.useState([]);

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');

  const handleDateSearch = (newValue) => {
    setSearchDate(newValue);
    //setSearchTerm('');

  }



  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );


  const handleFetchStories = React.useCallback(async () => {
    let srt = 46;
    if (sortBy.value == 58) {
      srt = 58;
    }

    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await axios.get('/events', { params: { sortby: srt } });

      /////////////////////////////////////////////////////////
      console.log("result", result.data);


      function searched(story) {
        return story.name.toLowerCase().includes(searchTerm.toLowerCase())
      }

      function currentevents(story) {
        return Date.parse(new Date(story.startDate)) >= Date.parse(new Date())
      }

      function ondateEvents(story) {
        console.log("hiiiii in ondate", new Date(story.startDate).getDate());
        return new Date(story.startDate).getDate() == new Date(searchDate).getDate()
      }

      function pastevents(story) {
        return Date.parse(new Date(story.startDate)) < Date.parse(new Date())
      }
      let newresult = [];

      result.data.forEach(elem => {
        const { name, url, startdatetime, enddatetime, postedby,tags } = elem;
        const temp = {
          name: name,
          url: url,
          postedby: postedby,
          startDate: startdatetime + "",
          endDate: enddatetime + "",
          tags : tags
        };
        newresult.push(temp);
      }
      );

      let currEvents = [];
      console.log("searchDate:", searchDate);
      console.log("newresult: ", newresult);

      if (searchDate.getDate() != new Date().getDate()) {
        console.log("searchdate currents: ", currEvents);
        currEvents = newresult.filter(ondateEvents);
        console.log("searchdate currents: ", currEvents);
      }
      else {
        currEvents = newresult.filter(currentevents);
        console.log("non search date currents: ", currEvents);

      }

      const searchedStories = currEvents.filter(searched);
      console.log("searchstories:", searchedStories);




      setPastStories(newresult.filter(pastevents));



      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: searchedStories, //txt
      });
    } catch {

      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }

  }, [url, searchDate, sortBy]);

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
    setSearchDate(null);

    event.preventDefault();
  };
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '2px dotted green',
      color: state.isSelected ? 'yellow' : 'black',
      backgroundColor: state.isSelected ? 'green' : 'white'
    }),
    control: (provided) => ({
      ...provided,
      marginTop: "5%",
    })
  }

  const handleSortBy = (value) => {
    console.log("inside handle sort by ", value); //{label:"trt" , value:46}

    setSortBy(value);


  }
  let title;
  if (sortBy.value == 46)
    title = "Upcoming tech events";
  else
    title = "Recently submitted tech events"



  return (

    <div >
      <Row horizontal="space-between" >


      </Row>
      <FilterSearchComponent handleSortBy={handleSortBy} />



      <h1 className="headline-primary">
      </h1>

      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (


          <List
            list={stories.data}
            title={title}
            onRemoveItem={handleRemoveStory}
          />


        )}




      <hr></hr>




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
        id={id}
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

    <PastEventsComponent containerStyles={styles.tasks} list={list} />

  </Row>)



const List = ({ list, title, onRemoveItem }) => (
  <Row horizontal="space-between" className={css(styles.lastRow)}
    breakpoints={{ 1024: 'column' }}>

    <TasksComponent containerStyles={styles.tasks} list={list} title={title} />

  </Row>)

const Item = ({ item, onRemoveItem }) => (

  <div className="item">
    <div className="sub-item1">

      <a href={item.url}>{item.name}</a>
    </div>
    <div className="sub-item2">
      start: {new Date(item.startDate).toUTCString()}
      <Countdown startDate={item.startDate} />
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

const StyledLabel = styled.label`
    
    padding-left: 5px;
    font-size: 19px;
    `;

const StyledInput = styled.input`
    border: none;
    border-bottom: 1px solid #171212;
    background-color: transperant;
    font-size: 21px;
    `;










export default App1;


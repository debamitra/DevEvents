import React, { useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import './App.css';


import AuthForms from './AuthForms'
import Signup from './Signup'

import TasksComponent from './TasksComponent';
import PastEventsComponent from './PastEventsComponent';

import { SubmitForm } from './components/SubmitForm';

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

import 'bootstrap/dist/css/bootstrap.min.css';











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
  },
  cardsContainer: {
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


const Submit = ({ postedbyuser, handleChange, taglist}) => (
  <div className="container-submit">
  
    <SubmitForm postedbyuser={postedbyuser} handleChange={handleChange} taglist={taglist} />

    </div>

)





const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='



/*const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  console.log("in semiPErsistnt");
  React.useEffect(() => { //function called  when value/key changes
    localStorage.setItem(key, value);
    console.log("in use effect in semipersistenat key:value", key, value);
  }, [value, key]);

  return [value, setValue];
};*/


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

  const [taglist, setTaglist] = React.useState([]);
  useEffect(() => {
      const fetchData = async () => {
          const result = await axios.get('api/tags');
          console.log("data events:", result.data);
          const newlist = result.data.map((item) => ({ value: item, label: item, color: '#0052CC' }))
          setTaglist(newlist);
          


      };

      fetchData();

  }, []);


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



  const element = (

    <Router>

      <Row className={css(styles.container)}>
        {/*
        <SidebarComponent />*/
}

        <Column flexGrow={1} className={css(styles.mainBlock)}>

          <HeaderComponent title={"home"} postedby={postedby} />
          <div className={css(styles.content)}>




            <Switch>
              <Route path="/submit">
                <Submit postedbyuser={postedby} handleChange={handleChange} taglist={taglist}/>
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
                <App taglist={taglist}/>
              </Route>
            </Switch>

          </div>
          <div id="element-align">
            <i>Meetup discovery app 2020</i>
          </div>
        </Column>


        {/*
        <SidebarComponent />*/
}
      </Row>
    </Router>
  );
  return element;
}


const initialList = [];


const App = ({taglist}) => {
  //const [taglist, setTaglist] = React.useState([]);

  
  
  const [singleTagSearch, setSingleTagSearch] = React.useState(null);
  const [searchResult, setSearchResult] = React.useState(null);
  const [sortBy, setSortBy] = React.useState({ label: "upcoming events", value: 46 });
  const [searchState, setSearchState] = React.useState({
    selectedOptionSortBy: { label: "upcoming events", value: 46 },
    selectedOptionTags: null,
    dates: new Date().toUTCString()
  });


  const [searchDate, setSearchDate] = React.useState(new Date());
  const [pastStories, setPastStories] = React.useState([]);

  //const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');

  const singleTagSearchEvents = () => {
    console.log("singleTagSearchEvents:state ", searchState);
    searchBySingleTag();
    

  };

  const searchBySingleTag =() => {
    axios
    .post('api/search', { ...searchState, selectedOptionTags: [].concat({value: singleTagSearch, label:singleTagSearch,color:'#0052CC' }) })
    .then(response => {
      //setResult(response.data);

      console.log("resp for singletag search in singleTagSearchEvents: ", response.data);

      handleSearchResult(response.data);


    })
    .catch(() => {
      //setResult({ sucess: false, message: 'something went wrong. try again' });
    });
  }







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

      const result = await axios.post('api/search',  { ...searchState });

      /////////////////////////////////////////////////////////
      console.log("stories fetch init result", result.data);


      /*function searched(story) {
        return story.name.toLowerCase().includes(searchTerm.toLowerCase())
      }*/

      function currentevents(story) {
        return Date.parse(new Date(story.startDate)) >= Date.parse(new Date())
      }

      /*function ondateEvents(story) {
        return new Date(story.startDate).getDate() == new Date(searchDate).getDate()
      }

      function pastevents(story) {
        return Date.parse(new Date(story.startDate)) < Date.parse(new Date())
      }
      */
      let newresult = [];

      result.data.forEach(elem => {
        const { name, url, startdatetime, enddatetime, postedby, tags } = elem;
        const temp = {
          name: name,
          url: url,
          postedby: postedby,
          startDate: startdatetime + "",
          endDate: enddatetime + "",
          tags: tags
        };
        newresult.push(temp);
      }
      );

      let currEvents = [];
      /*console.log("searchDate:", searchDate);
      console.log("newresult: ", newresult);

      if (searchDate.getDate() != new Date().getDate()) {
        console.log("searchdate currents: ", currEvents);
        currEvents = newresult.filter(ondateEvents);
        console.log("searchdate currents: ", currEvents);
      }
      else {
        */
        currEvents = newresult.filter(currentevents);
        console.log("non search date currents: ", currEvents);

      //}

      let searchedStories = [].concat(currEvents);

      console.log("searchresult", searchResult);

      if (searchResult != null) {
        console.log("in serarch null");
        let sresult = [];

        searchResult.forEach(elem => {
          const { name, url, startdatetime, enddatetime, postedby, tags } = elem;
          const temp = {
            name: name,
            url: url,
            postedby: postedby,
            startDate: startdatetime + "",
            endDate: enddatetime + "",
            tags: tags
          };
          sresult.push(temp);
        }
        );

        searchedStories = [].concat(sresult);

        console.log("searchedStories", searchedStories);

      }




      //setPastStories(newresult.filter(pastevents));



      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: searchedStories, //txt
      });
    } catch {

      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }

  }, [searchDate, sortBy, searchResult]);//re create only when any of these change



  React.useEffect(() => {
    handleFetchStories();

  }, [handleFetchStories]); // run only when re-created hence whe above states change.

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }




  const handleSortBy = (value) => {
    console.log("inside handle sort by ", value); //{label:"trt" , value:46}

    setSortBy(value);


  }

  const handleSearchResult = (value) => {
    console.log("inside handle search result by ", value); //{label:"trt" , value:46}

    setSearchResult(value);


  }
  let title;
  if (sortBy.value == 46)
    title = "Upcoming tech events";
  else
    title = "Recently submitted tech events"


  React.useEffect(() => {
    console.log(",singleTagSearch",singleTagSearch);
    if(singleTagSearch!= null){
    const tg = [].concat({value: singleTagSearch, label:singleTagSearch,color:'#0052CC' });
    setSearchState({...searchState, selectedOptionTags:tg} );
    
    singleTagSearchEvents();
    }

  }, [singleTagSearch]);









  return (

    <div >
      <Row horizontal="space-between" >


      </Row>

      <FilterSearchComponent state={searchState} setState={setSearchState} handleSortBy={handleSortBy} handleSearchResult={handleSearchResult} taglist={taglist}  />



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
            setSingleTagSearch={setSingleTagSearch}
          />


        )}




      <hr></hr>




    </div>

  );
};







const PastList = ({ list, onRemoveItem }) => (
  <Row horizontal="space-between" className={css(styles.lastRow)}
    breakpoints={{ 1024: 'column' }}>

    <PastEventsComponent containerStyles={styles.tasks} list={list} />

  </Row>)



const List = ({ list, title, onRemoveItem, setSingleTagSearch }) => (
  <Row horizontal="space-between" className={css(styles.lastRow)}
    breakpoints={{ 1024: 'column' }}>

    <TasksComponent containerStyles={styles.tasks} list={list} title={title} setSingleTagSearch={setSingleTagSearch} />

  </Row>)










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










export default App1;


import React from 'react';
import axios from 'axios';

import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';


function Tick() {
  const element = (
    <div className="clock">

      <h4>Hello, guest ! It's {new Date().toLocaleTimeString()}.</h4>
    </div>
  );
  ReactDOM.render(element, document.getElementById('time'));
}

setInterval(Tick, 1000);





const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='



const useSemiPersistentState = (key, initialState) => {
  const[value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key,value);
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
          story => action.payload.objectID != story.objectID
        ),
      };
      
    default :
      throw new Error();
  }
};




const App = () =>  {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

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
      const result = await axios.get(url);
    
          dispatchStories({
            type: 'STORIES_FETCH_SUCCESS',
            payload: result.data.hits,
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

 
  const searchedStories = stories.data.filter( story => 
     story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      <SearchForm searchTerm={searchTerm}
      onSearchInput={handleSearchInput}
      onSearchSubmit={handleSearchSubmit}
      />

      <hr></hr>

      
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory} 
        />
      )}

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
      <label htmlFor={id} className="label">{children} </label>
      &nbsp;
        <input ref={inputRef} 
        id ={id}
        type={type} 
        value={value} 
        onChange={onInputChange}
        className="input"
        />
      </>
  
    );
   };
   





const List = ({ list, onRemoveItem }) => 
  list.map(item => (
   <Item 
    key={item.objectID} 
    item={item}
    onRemoveItem={onRemoveItem}
   /> 
  ));

  const Item = ({item, onRemoveItem}) => {
    // const handleRemoveItem = () => {
    //   onRemoveItem(item);
    // };
    return (
    <div className="item">
      
      <span style={{ width: '40%'}}>
        <a href={item.url}>{item.title}</a>
      </span> 
      <span style={{width: '20%'}}><div className="details">by {item.author}</div></span>
      <span style={{width: '10%'}}><div className="details">{item.num_comments} comments</div></span>
      <span style={{width: '10%'}}><div className="details">{item.points} points</div></span>
      <span style={{ width: '10%' }}>
        <button type="button" onClick={() => onRemoveItem(item)} className="button button_small">
          Dismiss
        </button>
      </span>
      
    </div>
    
  )}

  const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit,
  }) => (
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button type="submit" disabled={!searchTerm}>
        Submit
      </button>
    </form>
  )




export default App;

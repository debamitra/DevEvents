import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';
import './reactTags.css'
import suggestions from './countries'



const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const TagsInput =({handletags}) => {

    const [state, setState] = React.useState({
        tags: [
            { id: "javascript", text: "javascript" },
            { id: "react", text: "react" }
         ],
        suggestions
    });

    React.useEffect(() => {
        console.log("in use effect");
        handletags(state.tags);
      }, [state.tags]);

    
    
    

    const handleDelete = (i) => {
        const { tags } = state;
        setState({
         tags: tags.filter((tag, index) => index !== i),
        });
        
    }

    const handleAddition= (tag) => {
        setState(state => ({ tags: [...state.tags, tag] }));
        
    }

    const handleDrag = (tag, currPos, newPos) => {
        const tags = [...state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setState({ tags: newTags });
    }

    
        console.log("suggs",state.tags);
        return (
            <div>
                <ReactTags tags={state.tags}
                    suggestions={state.suggestions}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    delimiters={delimiters} />
            </div>
        )
    
};

export default TagsInput;

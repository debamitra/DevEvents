import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';


import { colourOptions } from './data';
import Select from 'react-select';
import './reactpick.css';



//import "react-datepicker/dist/react-datepicker.css";

import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';




import "react-datepicker/dist/react-datepicker.css";



import 'bootstrap/dist/css/bootstrap.min.css';




const searchtags = [
    { label: "javascript", value: 355 },
    { label: "react", value: 54 }
];

const Countries = [
    { label: "upcoming events", value: 355 },
    { label: "recently submitted events", value: 54 }
];




const FilterSearchComponent = ({handleSortBy}) => {
    const [state, setState] = useState(
        {
            selectedOption: { label: "upcoming events", value: 46 },
          }
    );
    const addEvent = event => {
        console.log("state ", state);
        event.preventDefault();

    };

    React.useEffect(() => {
        console.log("in use effect");
        handleSortBy(state.selectedOption);
      }, [state.selectedOption]);

    const handleChangeSortBy = selectedOption => {
        setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };

    


    return (
        <div>
            <Form onSubmit={addEvent}>
                <div className="container-lg">
                    <div className="row">
                    Sort by :
                        <div className="col-md-2">
                            <Select placeholder="Sort by:" options={[{ label: "upcoming events", value: 46 },
                            { label: "recently submitted events", value: 58 }]}
                            value={state.selectedOption}
                            onChange={handleChangeSortBy}
                            />
                        </div>
                        
                        <div className="col-md-4">
                            <Select
                                defaultValue={[colourOptions[2], colourOptions[3]]}
                                isMulti
                                name="colors"
                                options={colourOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </div>

                        <div className="col-md-3 buttonIn">

                            <DateRangePicker
                                initialSettings={{  singleDatePicker: true, autoApply: true }}
                            >

                                <input type="text" className="form-control" />

                            </DateRangePicker>
                            <div aria-hidden="true" id="bu" class="select__indicator select__clear-indicator css-tlfecz-indicatorContainer"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-6q0nyr-Svg"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg></div>

                        </div>

                        <div className="col-md-2">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>

                        </div>
                    </div>
                </div>

            </Form>

        </div>
    );
}



export default FilterSearchComponent;
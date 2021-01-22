
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';


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




const FilterSearchComponent = ({state, setState, handleSortBy, handleSearchResult, taglist }) => {
    const [result, setResult] = useState(null);




   /* const [state, setState] = useState(
        {
            selectedOptionSortBy: { label: "upcoming events", value: 46 },
            selectedOptionTags: null,
            dates: new Date().toUTCString()
        }
    );*/
    const addEvent = event => {
        console.log("state ", state);
        event.preventDefault();

        axios
            .post('api/search', { ...state })
            .then(response => {
                setResult(response.data);

                console.log("resp: ", response.data);

                handleSearchResult(response.data);


            })
            .catch(() => {
                setResult({ sucess: false, message: 'something went wrong. try again' });
            });

    };

    const search = () => {
        console.log("search func state ", state);
       

        axios
            .post('api/search', { ...state })
            .then(response => {
                setResult(response.data);

                console.log("resp: ", response.data);

                handleSearchResult(response.data);


            })
            .catch(() => {
                setResult({ sucess: false, message: 'something went wrong. try again' });
            });

    };

    /*React.useEffect(() => {
        console.log("in use effect",state);
        search();
        //handleSortBy(state.selectedOptionSortBy);
    }, [state.selectedOptionSortBy]);*/

    const handleChangeSortBy = selectedOption => {
        setState({ ...state, selectedOptionSortBy: selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

    const handleChangeTags = selectedOption => {
        setState({ ...state, selectedOptionTags: selectedOption });
        console.log(`Option selected tags:`, selectedOption);
        console.log(`state in handle tags:`, state);
    };

    /*const handleDateEvent = (event, picker) => {
        console.log("handle date event", picker.startDate.toDate().toUTCString());
        //setState({ ...state, dates: picker.startDate.toDate().toUTCString() });
        console.log(`state in handle date event:`, state);

    }*/
    const handleDateCallback = (start, end, label) => {
        console.log("server timezone", start.toDate().toUTCString());
        console.log("handle date callback", start.toDate());
        console.log("handle date callback to ISO", start.toDate().toISOString());
        setState({ ...state, dates: start.toDate().toUTCString() });
        console.log(`state in handle date callback:`, state);
    }
    ////////////////////////////////////////////////////////////////////////
    const handleApply = (event, picker) => {
        picker.element.val(
            picker.startDate.format('MM/DD/YYYY') +
            ' - ' +
            picker.endDate.format('MM/DD/YYYY')
        );
    };
    const handleCancel = (event, picker) => {
        picker.element.val('');
    };
    ////////////////////////////////////////////////////////////////////





    return (
        <div>
            <Form onSubmit={addEvent}>
                <Container fluid={"sm"} >
                    <Row >
                        <Col>Sort by : </Col>
                        <Col className="with-margin" xs={12} md={3}>
                            <Select placeholder="Sort by:" options={[{ label: "upcoming events", value: 46 },
                            { label: "recently submitted events", value: 58 ,isDisabled: true}]}
                                value={state.selectedOptionSortBy}
                                onChange={handleChangeSortBy}
                            />
                        </Col>

                        <Col className="with-margin" xs={12} md={4}>
                            <Select
                                //defaultValue={[colourOptions[2], colourOptions[3]]}
                                isMulti
                                name="colors"
                                value={state.selectedOptionTags}
                                onChange={handleChangeTags}
                                options={taglist}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </Col>

                        <Col className="with-margin" xs={12} md={3}>

                            <DateRangePicker
                                initialSettings={{ singleDatePicker: true, autoApply: true }}
                                //onEvent={handleDateEvent}
                                onCallback={handleDateCallback}
                            >

                                <input type="text" className="form-control" />

                            </DateRangePicker>

                        </Col>
                        {/*
                            <DateRangePicker
                                initialSettings={{ 
                                    autoUpdateInput: true,
                                    locale: {
                                        cancelLabel: 'Clear',
                                    },
                                }}
                                onApply={handleApply}
                                onCancel={handleCancel}
                            >
                                <input type="text" className="form-control col-4" defaultValue="" />
                            </DateRangePicker>
                            <div aria-hidden="true" id="bu" class="select__indicator select__clear-indicator css-tlfecz-indicatorContainer"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-6q0nyr-Svg"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg></div>
                                */
                        }


                        <Col className="with-margin" xs={12} md={1}>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>

                        </Col>

                    </Row>
                </Container>

            </Form>

        </div>
    );
}



export default FilterSearchComponent;
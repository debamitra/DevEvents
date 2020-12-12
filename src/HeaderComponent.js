import React from 'react';
import { string } from 'prop-types';
import { Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import IconSearch from './assets/icon-search';
import IconBellNew from './assets/icon-bell-new';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

const styles = StyleSheet.create({
    avatar: {
        height: 35,
        //width: 35,
        borderRadius: 50,
        marginLeft: 14,
        border: '1px solid #DFE0EB',
    },
    container: {
        height: 40
    },
    cursorPointer: {
        cursor: 'pointer'
    },
    name: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: 14,
        lineHeight: '20px',
        textAlign: 'right',
        letterSpacing: 0.2,
        //'@media (max-width: 768px)': {
          //  display: 'none'
        //}
    },
    separator: {
        borderLeft: '1px solid #DFE0EB',
        marginLeft: 32,
        marginRight: 32,
        height: 32,
        width: 2,
        '@media (max-width: 768px)': {
            marginLeft: 12,
            marginRight: 12
        }
    },
    title: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: '30px',
        letterSpacing: 0.3,
        '@media (max-width: 768px)': {
            marginLeft: 36
        },
        '@media (max-width: 468px)': {
            fontSize: 20
        }
    },
    iconStyles: {
        cursor: 'pointer',
        marginLeft: 25,
        '@media (max-width: 768px)': {
            marginLeft: 12
        }
    }
});

function HeaderComponent(props) {
    const { icon, title, postedby, ...otherProps } = props;

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
          return [<Link style={{padding: 20}} to="/login">login</Link>, <div className={css(styles.separator)}></div>,
        <Link style={{padding: 20}} to="/signup">signup</Link> ]
        }
      }
    

    
      
      
      
    return (
        <Row className={css(styles.container)} vertical="center" horizontal="space-between" {...otherProps}>
            
            <Link style={{marginLeft: 0}} to="/">home</Link> 
            <Link style={{padding: 20}} to="/submit">submit</Link> 
            <Row vertical="center">
                {/*<div className={css(styles.iconStyles)}>
                    <IconSearch />
    </div>*/}
                
                
                <Greeting /> <div className={css(styles.separator)}></div>
                
                <span>  Hi { postedby != "" ? postedby : "guest" } </span>  
                
                
            </Row>
        </Row>
    );
}

HeaderComponent.propTypes = {
    title: string
};

export default HeaderComponent;
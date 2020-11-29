import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';
import MiniCardComponent from './MiniCardComponent';
import TasksComponent from './TasksComponent';
import PastEventsComponent from './PastEventsComponent';


const styles = StyleSheet.create({
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

function ContentComponent(list) {
    console.log("hiiii",list);
    return (
        <Column >
            
            <Row horizontal="space-between" className={css(styles.lastRow)}
    breakpoints={{ 1024: 'column' }}>
    
    <TasksComponent containerStyles={styles.tasks} list={list}/>
    
</Row>
<PastEventsComponent containerStyles={styles.tasks} />

            
           
        </Column>
    );
}

export default ContentComponent;
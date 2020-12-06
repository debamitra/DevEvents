import React from 'react';
import { Column } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #DFE0EB',
        borderRadius: 6,
        cursor: 'pointer',
        height: 50,
        maxWidth: 40,
        padding: '14px 30px 14px 30px',
        ':hover': {
            borderColor: '#3751FF',
            ':nth-child(n) > span': {
                color: '#3751FF'
            }
        }
    },
    title: {
        color: '#9FA2B4',
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: '4px',
        letterSpacing: '0.4px',
        marginBottom: 12,
        minWidth: 102,
        textAlign: 'center'
    },
    value: {
        color: '#252733',
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: '1px',
        lineHeight: '5px',
        textAlign: 'center'
    },
    day: {
        color: '#252733',
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: '1px',
        lineHeight: '5px',
        textAlign: 'center',
    }
});

const monthNames = ["JAN", "FEB", "MAR", "APR", "May", "June",
  "July", "August", "September", "OCT", "NOV", "DEC"
];
const dayNames = ["sunday","monday", "tuesday","wednesday","thursday","friday", "saturday"]

function MiniCardComponent({ className = '', title, value , day}) {
    const composedClassName = `${css(styles.container)} ${className}`;
    return (
        <Column flexGrow={1} className={composedClassName} horizontal="center" vertical="center">
            <span className={css(styles.title)}>{monthNames[title]}</span>
            <span className={css(styles.value)}>{value}</span>
            
        </Column>
    );
}

export default MiniCardComponent;
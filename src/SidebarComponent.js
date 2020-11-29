import React from 'react';
import { Column } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#363740',
        width: 120,
        paddingTop: 32
    },
   
    separator: {
        borderTop: '1px solid #DFE0EB',
        marginTop: 16,
        marginBottom: 16,
        opacity: 0.06
    }
});

function SidebarComponent(props) {
    return (
        <Column className={css(styles.container)}>
            
        </Column>
    );
}

export default SidebarComponent;
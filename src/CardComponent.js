import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';
import MiniCardComponent from './MiniCardComponent';
import ContentLoader, { Facebook } from "react-content-loader";


const MyLoader = () => (
    <ContentLoader>
      <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
      <rect x="80" y="10" rx="4" ry="4" width="600" height="13" />
      <rect x="80" y="30" rx="3" ry="3" width="300" height="10" />
      <rect x="80" y="55" rx="3" ry="3" width="400" height="10" />
  
    </ContentLoader>
  );

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #DFE0EB',
        borderRadius: 4,
        padding: '24px 32px 12px 32px'
    },
    containerMobile: {
        padding: '12px 16px 6px 16px !important'
    },
    itemContainer: {
        marginLeft: -32,
        marginRight: -32,
        paddingLeft: 32,
        paddingRight: 32,
        paddingBottom: 18,
        paddingTop: 18,
        //maxHeight: 100,
        borderBottom: '1px solid #DFE0EB',
        ':last-child': {
            borderBottom: 'none'
        }
    },
    itemContainerMobile: {
        marginLeft: -16,
        marginRight: -16,
        paddingLeft: 16,
        paddingRight: 16
    },
    link: {
        //fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: '#3751FF',
        textAlign: 'right',
        cursor: 'pointer'
    },
    subtitle: {
        //fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 12,
        lineHeight: '16px',
        letterSpacing: '0.1px',
        color: '#9FA2B4'
    },
    subtitle2: {
        color: '#252733',
        marginLeft: 2
    },
    title: {
        //fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 19,
        lineHeight: '24px',
        letterSpacing: '0.4px',
        color: '#252733'
    },
    miniCardContainer: {
        flexGrow: 1,
        marginRight: 10,
        '@media (max-width: 768px)': {
            marginTop: 30,
            maxWidth: 'none'
        }
    }
});

class CardComponent extends React.Component {

    renderItem(item, index) {
        return (<Column flexGrow={1} className={css(styles.itemContainer)} key={`item-${index}`}
            breakpoints={{ 426: css(styles.itemContainerMobile) }}>
                
                   
                    
            {item}
        </Column>);
    }

    render() {
        const { title, link, subtitle, items, containerStyles, isLoading } = this.props;
        const placeholderItems = [<MyLoader /> , <MyLoader/>, <MyLoader />, <MyLoader />];
        return (
            <Column flexGrow={1} className={css(styles.container, containerStyles)} breakpoints={{ 426: css(styles.containerMobile) }}>
                <Row horizontal="space-between">
                    
                    <Column>
                        <span className={css(styles.title)}>{title}</span>
                        <Row style={{ marginTop: 8, marginBottom: 16 }}>
                            <span className={css(styles.subtitle)}>{subtitle}</span>
                            
                        </Row>
                    </Column>
                    <span className={css(styles.link)}>{link}</span>
                </Row>
                    {isLoading ? (
                        placeholderItems.map(this.renderItem)
        
                    ) : (

                        items.map(this.renderItem)
                 )}

                
            </Column>
        );
    }
}

export default CardComponent;
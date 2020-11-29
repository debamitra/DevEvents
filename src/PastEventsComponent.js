import React from 'react';
import { Row , Column} from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';
import CardComponent from './CardComponent';
import MiniCardComponent from './MiniCardComponent';


const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#F0F1F7',
        color: '#9FA2B4',
        fontSize: 20,
        padding: 7
    },
    itemTitle: {
        color: '#252733',
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: '0.2px',
        lineHeight: '20px'
    },
    itemValue: {
        color: '#9FA2B4'
    },
    greyTitle: {
        color: '#C5C7CD'
    },
    tagStyles: {
        borderRadius: 5,
        cursor: 'pointer',
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 11,
        letterSpacing: '0.5px',
        lineHeight: '14px',
        padding: '5px 12px 5px 12px'
    },
    checkboxWrapper: {
        cursor: 'pointer',
        marginRight: 16
    },
    miniCardContainer: {
        flexGrow: 1,
        marginRight: 30,
        
        '@media (max-width: 768px)': {
            marginTop: 30,
            maxWidth: 'none'
        }
    },
    subtitle: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 12,
        lineHeight: '16px',
        letterSpacing: '0.1px',
        color: '#515467'
    }
});

const TAGS = {
    URGENT: { text: 'meetup', backgroundColor: '#FEC400', color: '#FFFFFF' },
    NEW: { text: 'livestream', backgroundColor: '#29CC97', color: '#FFFFFF' },
    DEFAULT: { text: 'webinar', backgroundColor: '#F0F1F7', color: '#9FA2B4' },
}

class PastEventsComponent extends React.Component {

    state = { items: [
        {title: 'My awesome tech event', checked: false, tag: TAGS.URGENT },
        {title: 'React for beginners , an introductory talk', checked: false, tag: TAGS.NEW },
        {title: 'Jims roundup of react 17', checked: true, tag: TAGS.DEFAULT }
    ]};

    renderTask = ({title, tag = {} }, index) => (
        <Row horizontal="space-between" vertical="center">
            
            <Row>
                <MiniCardComponent className={css(styles.miniCardContainer)} title="Nov" value="26" />
                    
                <Column>
                <span className={css(styles.itemTitle)}>{title}</span>
                
                
                <span className={css(styles.subtitle)}>online | posted by apdfgh | 12 hrs 3 mins left</span>
                </Column> 
                
               
                
            </Row>
            
            {this.renderTag(tag, index)}
        </Row>
    );

    renderTag = ({ text, backgroundColor, color }, index) => (
        <Row horizontal="center" vertical="center"
            style={{ backgroundColor, color }} className={css(styles.tagStyles)}
            onClick={() => this.onTagClick(index)}>
            {text}
        </Row>
    );

    

  

    getNextTag = (except = 'URGENT') => {
        const tagLabels = ['URGENT', 'NEW', 'DEFAULT'];
        const tagIndex = (tagLabels.indexOf(except) + 1) % 3;
        return TAGS[tagLabels[tagIndex]];
    }

    onTagClick = (index) => this.setState(prevState => {
        const items = prevState.items;
        items[index].tag = this.getNextTag(items[index].tag.text);
        return { items };
    })

    onAddButtonClick = () => this.setState(prevState => {
        const items = prevState.items;
        items.push({ title: `Task ${items.length + 1}`, checked: false, tag: this.getNextTag() });
        return { items };
    });

    renderAddButton = () => (
        <Row horizontal="center" vertical="center" className={css(styles.tagStyles, styles.addButton)} onClick={this.onAddButtonClick}>
            +
        </Row>
    )

    render() {
        return (
            <CardComponent containerStyles={this.props.containerStyles} title="Past tech events" link="View all" subtitle="Past"
                items={[
                    <Row horizontal="space-between" vertical="center">
                        <span className={css(styles.itemTitle, styles.greyTitle)}>add a tech event</span>
                        {this.renderAddButton()}
                    </Row>,
                    ...this.state.items.map(this.renderTask)
                ]}
            />
        );
    }
}

export default PastEventsComponent;
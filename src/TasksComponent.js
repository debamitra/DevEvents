import React from 'react';
import { Row, Column } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite/no-important';
import CardComponent from './CardComponent';
import MiniCardComponent from './MiniCardComponent';
import Countdown from './Countdown';


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
        fontSize: 18,
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
        fontSize: 14,
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

class TasksComponent extends React.Component {


    state = {
        items: [
            { title: 'My awesome tech event', checked: false, tag: TAGS.URGENT },
            { title: 'React for beginners , an introductory talk', checked: false, tag: TAGS.NEW },
            { title: 'Jims roundup of react 17', checked: true, tag: TAGS.DEFAULT }
        ]
    };

    renderTask = ({ name, url, startDate, endDate, postedby, tag = TAGS.URGENT }, index) => {
        console.log("render task");
        const month = new Date(startDate).getMonth();
        return (
            <Row
                flexGrow={1} wrap
                //horizontal="space-between"
                // vertical="center"
                breakpoints={{ 900: "column" }}
            >


                <Column
                    breakpoints={{
                        900: {},

                    }}
                //flexGrow={1}
                >
                    <MiniCardComponent className={css(styles.miniCardContainer)} title={month} value={new Date(startDate).getDate()} day={new Date(startDate).getDay()} />
                </Column>
                <Column
                    breakpoints={{ 900: {} }}
                //flexGrow={1}
                >

                    <span className={css(styles.itemTitle)}><a href={url}>{name}</a></span>


                    <span className={css(styles.subtitle)}>online | posted by {postedby}  </span>

                    <Countdown startDate={startDate} />

                </Column>
                <Column>

                    <Row horizontal="spaced">{this.renderTag(tag, index)}</Row>

                </Column>



            </Row>
        );
    }

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
        const { containerStyles, list } = this.props;
        console.log("list: ", list);
        let newresult = [];
        const temp = {
            name: "ntestame",
            url: "testurl",
            postedby: "postedby",
            startDate: "startdatetime" + "",
            endDate: "enddatetime" + ""
        };
        newresult.push(temp);
        const text = newresult.concat(list);
        console.log("text  ", text);
        return (

            <CardComponent containerStyles={this.props.containerStyles} title="Upcoming tech events" link="" subtitle="Recent"
                items={[
                    /*<Row horizontal="space-between" vertical="center">
                        <span className={css(styles.itemTitle, styles.greyTitle)}>add a tech event</span>
                        {this.renderAddButton()}
                    </Row>,*/
                    ...list.map(this.renderTask)
                ]}
            />
        );
    }
}

export default TasksComponent;
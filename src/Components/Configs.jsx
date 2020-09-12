import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

export function Container (props) {
return <View style={styles.Container}>{props.children}</View>;
}
export function ConfigsContainer (props) {
return <ScrollView contentContainerStyle={styles.ConfigsContainer_content} style={styles.ConfigsContainer}>{props.children}</ScrollView>;
}
export function Config(props) {
    return <TouchableHighlight underlayColor="rgb(200,200,200)" onPress={props.onPress} style={styles.Config}>
        <>
            <Text style={styles.Config_title}>{props.text}</Text>
            <Text style={styles.Config_desc}>{props.description}</Text>
        </>
    </TouchableHighlight>
}

const styles = StyleSheet.create({
    Container: {
        flex: 1
    },
    ConfigsContainer: {
        flex: 1,
        backgroundColor: 'rgb(240,240,240)'
    },
    ConfigsContainer_content: {
        flexDirection: 'column'
    },
    Config: {
        backgroundColor: 'rgb(230,230,230)',
        padding: 5
    },
    Config_title: {
        fontSize: 20
    },
    Config_desc: {
        fontSize: 12
    }
})
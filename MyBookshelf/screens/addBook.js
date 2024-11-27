import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function AddBook() {
    return (
        <View style={styles.container}>
            <Text>Search a new from Google Books API</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fffaf4',
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    smallSpace: {
        height: 10,
    },
    mediumSpace: {
        height: 35,
    }
});
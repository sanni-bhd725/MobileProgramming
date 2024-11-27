import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { FIREBASE_AUTH } from "../firebaseConfig";
import AddBook from "./AddBook";

export default function Bookshelf({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Bookshelf</Text>
            {/* <Button onPress={() => FIREBASE_AUTH.signOut()} title="Sign out" /> */}
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
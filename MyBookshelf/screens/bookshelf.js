import { View, Text, Button } from "react-native";
import React from "react";
import { FIREBASE_AUTH } from "../firebaseConfig";
import AddBook from "./addBook";

export default function Bookshelf({ navigation }) {
    return (
        <View>
            <Text>Bookshelf</Text>
            <Button onPress={() => navigation.navigate('AddBook')} title="Add a new book" />
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Sign out" />
        </View>
    )
};
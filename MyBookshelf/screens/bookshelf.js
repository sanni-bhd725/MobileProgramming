import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList, TextInput, Image } from "react-native";
import axios from "axios";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { GOOGLE_BOOKS_API_KEY } from '@env';

export default function Bookshelf() {
    const [userShelf, setUserShelf] = useState([]);

    const user = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        const fetchUserShelf = async () => {
            const shelfRef = collection(FIREBASE_DB, `users/${user.uid}/shelf`);
            const snapshot = await getDocs(shelfRef);
            const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserShelf(books);
        };

        fetchUserShelf();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>My Bookshelf</Text>
            <FlatList
                data={userShelf}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.book}>
                        {item.thumbnail && (
                            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                        )}
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.authors}>{item.authors?.join(", ")}</Text>
                        <Text style={styles.publishedDate}>{item.publishedDate}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        flex: 1,
        backgroundColor: '#a5aa9e',
    },
    input: {
        height: 40,
        borderColor: "lightslategray",
        backgroundColor: "#f0f0ee",
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 8,
    },
    book: {
        flexDirection: 'row',
        marginBottom: 16,
        padding: 8,
        backgroundColor: '#f9f4ee',
        borderRadius: 5,
        alignItems: 'center',
    },
    thumbnail: {
        width: 80,
        height: 120,
        marginRight: 16,
    },
    bookDetails: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    authors: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    publishedDate: {
        fontSize: 12,
        color: '#777',
        marginBottom: 8,
    },
});
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList, TextInput, Image, Alert } from "react-native";
import axios from "axios";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { GOOGLE_BOOKS_API_KEY } from '@env';

export default function AddBook() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [userShelf, setUserShelf] = useState([]);

    const user = FIREBASE_AUTH.currentUser;

    const fetchUserShelf = async () => {
        try {
            const shelfRef = collection(FIREBASE_DB, `users/${user.uid}/shelf`);
            const snapshot = await getDocs(shelfRef);
            const books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setUserShelf(books);
        } catch (error) {
            console.error("Error fetching user shelf:", error);
        }
    };

    useEffect(() => {
        fetchUserShelf();
    }, []);

    const searchBooks = async () => {
        try {
            const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
                params: {
                    q: query,
                    key: GOOGLE_BOOKS_API_KEY,
                }
            });
            setSearchResults(response.data.items || []);
        } catch (error) {
            console.error("Error on fetching books:", error);
        }
    };

    const addToShelf = async (book) => {
        try {
            const shelfRef = collection(FIREBASE_DB, `users/${user.uid}/shelf`);
            await addDoc(shelfRef, {
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors || ["Unknown Author"],
                publishedDate: book.volumeInfo.publishedDate || "Unknown Date",
                thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
            });
            setUserShelf((prevShelf) => [...prevShelf, {
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors || ["Unknown Author"],
                publishedDate: book.volumeInfo.publishedDate || "Unknown Date",
                thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
            }]);
            Alert.alert('Success', 'Book is successfully added');
            await fetchUserShelf();
        } catch (error) {
            Alert.alert("Error", "Error while adding a book");
            console.error("Error while adding a book:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search for books"
                value={query}
                onChangeText={text => setQuery(text)}
            />
            <Button color='darkslategrey' title="Search" onPress={searchBooks} />
            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.book}>
                        <Image
                            source={{ uri: item.volumeInfo.imageLinks?.thumbnail }}
                            style={styles.thumbnail}
                        />
                        <View style={styles.bookDetails}>
                            <Text style={styles.title}>{item.volumeInfo.title}</Text>
                            <Text style={styles.authors}>{item.volumeInfo.authors?.join(", ")}</Text>
                            <Text style={styles.publishedDate}>{item.volumeInfo.publishedDate}</Text>
                            <Button color='#5d6452' title="Add to Bookshelf" onPress={() => addToShelf(item)} />
                        </View>
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
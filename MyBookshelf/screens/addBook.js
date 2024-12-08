import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList, TextInput, Image, Alert } from "react-native";
import axios from "axios";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { GOOGLE_BOOKS_API_KEY } from '@env';

export default function AddBook({ navigation }) {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [userShelf, setUserShelf] = useState([]);

    const user = FIREBASE_AUTH.currentUser;

    const fetchUserShelf = async () => {
        if (!user) return;

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
    }, [userShelf]);

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
        if (!user) {
            Alert.alert("Error", "User not logged in");
            return;
        }
        try {
            const shelfRef = collection(FIREBASE_DB, `users/${user.uid}/shelf`);
            await addDoc(shelfRef, {
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors || ["Unknown Author"],
                publishedDate: book.volumeInfo.publishedDate || "Unknown Date",
                thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
            });
            Alert.alert('Success', 'Book is successfully added');

            navigation.navigate('Bookshelf', {
                newBook: {
                    title: book.volumeInfo.title,
                    authors: book.volumeInfo.authors || ["Unknown Author"],
                    publishedDate: book.volumeInfo.publishedDate || "Unknown Date",
                    thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
                },
            });

        } catch (error) {
            Alert.alert("Error", "Error while adding a book");
            console.error("Error while adding a book:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Add books from Google Books</Text>
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
                            <Text style={styles.authors}>{item.volumeInfo.authors}</Text>
                            <Text style={styles.publishedDate}>{item.volumeInfo.publishedDate}</Text>
                            <View style={styles.buttonSize}>
                                <Button color='gray' title="Add to Shelf" onPress={
                                    () => addToShelf(item)} />
                            </View>
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
        backgroundColor: 'slategray',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 8,
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
        marginTop: 12,
        marginBottom: 2,
        padding: 8,
        backgroundColor: 'seashell',
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
    buttonSize: {
        maxWidth: '45%'
    },
});
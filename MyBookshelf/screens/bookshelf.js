import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, Alert, Modal, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, deleteField, updateDoc } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";

export default function Bookshelf({ route }) {
    const [userShelf, setUserShelf] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const user = FIREBASE_AUTH.currentUser;
    const isFocused = useIsFocused();

    // Haetaan Firebasesta käyttäjän tallentamat kirjat
    const fetchUserShelf = async () => {
        const shelfRef = collection(FIREBASE_DB, `users/${user.uid}/shelf`);
        const snapshot = await getDocs(shelfRef);
        const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserShelf(books);
    };
    useEffect(() => {
        fetchUserShelf();
    }, [isFocused]);

    // Haetaan lista, jos se on päivittynyt aiemmasta
    useEffect(() => {
        if (route.params?.newBook) {
            setUserShelf((prevShelf) => [...prevShelf, route.params.newBook]);
        }
    }, [route.params?.newBook]);

    // Kirjan poistaminen omasta hyllystä
    const removeBook = async (bookId) => {
        try {
            const bookRef = doc(FIREBASE_DB, `users/${user.uid}/shelf`, bookId);
            await deleteDoc(bookRef);
            Alert.alert("Success", "Book removed successfully");
            fetchUserShelf();
        } catch (error) {
            console.error("Error while removing book:", error);
            Alert.alert("Error", "Failed to remove the book");
        }
    };

    // Varmistus, että poisto halutaan tehdä
    const confirmRemove = (bookId) => {
        Alert.alert(
            "Remove Book",
            "Are you sure you want to remove this book?",
            [
                { text: "Remove", onPress: () => removeBook(bookId) },
                { text: "Cancel" },
            ]
        );
    };

    // Avataan arvostelu-modal
    const openReviewModal = (book) => {
        setSelectedBook(book);
        setRating(book.rating || 0);
        setReview(book.review || "");
        setModalVisible(true);
    };

    // Tallennetaan arvostelu Firebaseen
    const saveReview = async () => {
        try {
            const bookRef = doc(FIREBASE_DB, `users/${user.uid}/shelf`, selectedBook.id);
            await updateDoc(bookRef, {
                rating,
                review,
            });
            setModalVisible(false);
            fetchUserShelf();
        } catch (error) {
            console.error("Error while saving review:", error)
            Alert.alert("Error", "Failed to save the review");
        }
    };

    // Poistetaan arvostelu
    const deleteReview = async () => {
        try {
            const bookRef = doc(FIREBASE_DB, `users/${user.uid}/shelf`, selectedBook.id);
            await updateDoc(bookRef, {
                rating: deleteField(),
                review: deleteField(),
            });
            setModalVisible(false);
            fetchUserShelf();
        } catch (error) {
            console.error("Error while deleting review:", error)
            Alert.alert("Error", "Failed to delete the review");
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>My Bookshelf</Text>

            {/* Hyllyyn lisättyjen kirjojen tiedot */}
            <FlatList
                data={userShelf}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.book}>
                        {item.thumbnail && (
                            <Image
                                source={{ uri: item.thumbnail }}
                                style={styles.thumbnail} />
                        )}
                        <View style={styles.bookDetails}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.authors}>{item.authors}</Text>
                            <Text style={styles.publishedDate}>{item.publishedDate}</Text>
                            <View style={styles.bookButtons}>
                                <Button title="Review" color="grey" onPress={() => openReviewModal(item)} />
                                <Button title="Remove" color="maroon" onPress={() => confirmRemove(item.id)} />
                            </View>
                            {item.rating && (
                                <View style={styles.reviewSummary}>
                                    <Text style={styles.starRating}>
                                        {"⭐".repeat(item.rating)}
                                    </Text>
                                    <Text style={styles.reviewText}>"{item.review?.substring(0, 30)}"</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            />

            {/* Arvostelu pop-up modal */}
            <Modal visible={modalVisible} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Review the Book</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <FontAwesome name={star <= rating ? "star" : "star-o"} size={32} color="gold" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput style={styles.input} placeholder="Write your review" value={review} onChangeText={setReview} multiline />
                        <Button title="Save Review" color="grey" onPress={saveReview} />
                        <View style={styles.smallSpace} />
                        <Button title="Delete Review" color="maroon" onPress={deleteReview} />
                        <View style={styles.smallSpace} />
                        <Button title="Close" color="darkslategrey" onPress={() => setModalVisible(false)} />

                    </View>
                </View>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        flex: 1,
        backgroundColor: "slategray",
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
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 8,
    },
    book: {
        flexDirection: "row",
        marginBottom: 16,
        padding: 8,
        backgroundColor: "seashell",
        borderRadius: 5,
        alignItems: "center",
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
        fontWeight: "bold",
        marginBottom: 4,
    },
    authors: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4,
    },
    publishedDate: {
        fontSize: 12,
        color: "#777",
        marginBottom: 8,
    },
    bookButtons: {
        maxWidth: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    reviewSummary: {
        marginTop: 3,
        flexDirection: "column",
        justifyContent: "center",
    },
    starRating: {
        fontSize: 16,
    },
    reviewText: {
        fontSize: 14,
        fontStyle: "italic",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        padding: 20,
        backgroundColor: "seashell",
        borderRadius: 6,
    },
    modalTitle: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    smallSpace: {
        height: 7,
    },
});
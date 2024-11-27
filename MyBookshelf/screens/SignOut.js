import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';

export default function SignOut({ navigation }) {
    useEffect(() => {
        // Suoritetaan uloskirjautuminen, kun tämä komponentti avataan
        FIREBASE_AUTH.signOut()
            .then(() => {
                // Ohjataan takaisin kirjautumisnäkymään
                navigation.replace('Login');
            })
            .catch((error) => {
                console.error('Sign-out error:', error);
            });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text>Signing out...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

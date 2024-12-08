import { View, StyleSheet, TextInput, ActivityIndicator, Button, Text, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Lähde: Firebase Autentikointi otettu käyttöön tätä ohjevideota soveltaen:
// https://www.youtube.com/watch?v=ONAVmsGW6-M

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            // console.log(response);
            alert('Account created! We have signed you in.');
        } catch (error) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.loginField}>
                <Text style={styles.loginTitle}>Welcome</Text>
                <Text style={styles.loginInfoText}>
                    Please sign in or create a new account by filling in your email and password of your choice.
                </Text>
                <KeyboardAvoidingView behavior="padding">
                    <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address"
                        onChangeText={(text) => setEmail(text)}></TextInput>
                    <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none"
                        onChangeText={(text) => setPassword(text)}></TextInput>
                    <View style={styles.mediumSpace} />
                    {loading ? (<ActivityIndicator size="large" color={"#0000ff"} />
                    ) : (
                        <>
                            <Button color='darkslategrey' title="Login" onPress={() => signIn()} />
                            <View style={styles.smallSpace} />
                            <Button color='grey' title="Create account" onPress={() => signUp()} />
                        </>
                    )}
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'slategray',
    },
    loginField: {
        paddingHorizontal: 15,
        paddingTop: 30,
        paddingBottom: 40,
        borderRadius: 4,
        backgroundColor: 'seashell'
    },
    loginTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    loginInfoText: {
        fontSize: 14,
        marginBottom: 30,
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
        height: 20,
    }
});
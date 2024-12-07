import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import Login from "../screens/Login";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

export default function Layout() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            console.log("user", user);
            setUser(user);
        });
        return unsubscribe;
    }, []);

    return (
        <Stack.Navigator initialRouteName="Login">
            {user ? (
                <Stack.Screen
                    name="Inside"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
            ) : (
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
            )}
        </Stack.Navigator>
    );
}

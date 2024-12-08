import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Bookshelf from "../screens/bookshelf";
import AddBook from "../screens/addBook";
import SignOut from "../screens/SignOut";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === "Bookshelf") {
                        iconName = "book";
                    } else if (route.name === "Add Book") {
                        iconName = "add-circle";
                    } else if (route.name === "Sign Out") {
                        iconName = "log-out";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "darkslategrey",
                tabBarInactiveTintColor: "darkgrey",
                tabBarActiveBackgroundColor: "seashell",
                tabBarInactiveBackgroundColor: "seashell",
            })}
        >
            <Tab.Screen name="Bookshelf" component={Bookshelf} />
            <Tab.Screen name="Add Book" component={AddBook} />
            <Tab.Screen name="Sign Out" component={SignOut} />
        </Tab.Navigator>
    );
}
import { Pressable } from "react-native";

import { Tabs } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#5E64FF",
                tabBarInactiveTintColor: "#DADADA",
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: "#232533",
                },
                headerShown: false,
                tabBarButton: (props) => {
                    return <Pressable {...props} android_ripple={null} />;
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            key="home"
                            name="wifi"
                            size={28}
                            className="rotate-90"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="sheet"
                options={{
                    title: "Attendance Sheet",
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            key="sheet"
                            name="document-text-outline"
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Setting",
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            key="setting"
                            name="settings-outline"
                            size={30}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

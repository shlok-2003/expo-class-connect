import { useState, useEffect, useCallback } from "react";
import { Alert, TouchableOpacity } from "react-native";

import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Stack, usePathname } from "expo-router";

import { useUserStore } from "@/stores/user-store";

export default function Layout() {
    const { user, token } = useUserStore();
    const pathname = usePathname();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isRequesting, setIsRequesting] = useState(false);

    const requestPermission = useCallback(async () => {
        if (isRequesting || !user || !token) return;
        setIsRequesting(true);

        try {
            const { status, canAskAgain } =
                await Location.requestForegroundPermissionsAsync();

            if (status === "granted") {
                setHasPermission(true);
                await Location.enableNetworkProviderAsync();
            } else {
                setHasPermission(false);

                if (canAskAgain) {
                    Alert.alert(
                        "Permission Required",
                        "This app needs location access to function properly.",
                        [
                            { text: "Cancel", style: "cancel" },
                            { text: "Retry", onPress: requestPermission },
                        ],
                    );
                } else {
                    Alert.alert(
                        "Permission Denied",
                        "You have permanently denied location access. Please enable it in settings.",
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Open Settings",
                                onPress: () => Linking.openSettings(),
                            },
                        ],
                    );
                }
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: "An error occurred while requesting location access.",
            });
        } finally {
            setIsRequesting(false);
        }
    }, [isRequesting, token, user]);

    useEffect(() => {
        requestPermission();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    if (hasPermission === null || !user || !token) {
        return null;
    }

    return (
        <Stack
            screenOptions={{
                title: user.name,
                headerTitleAlign: "center",
                headerBackTitle: "",
                headerLeft: () => (
                    <TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
                        <Ionicons name="notifications" size={28} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
                        <Ionicons name="person" size={28} />
                    </TouchableOpacity>
                ),
            }}
        />
    );
}

import { Fragment, useEffect } from "react";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import {
    useFonts,
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
} from "@expo-google-fonts/open-sans";

import "@/styles/global.css";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export default function Layout() {
    const [loaded, error] = useFonts({
        OpenSans_300Light,
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold,
        OpenSans_700Bold,
        OpenSans_800ExtraBold,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <Fragment>
            <StatusBar style="dark" />
            <RootLayout />
            <Toast />
        </Fragment>
    );
}

function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="(auth)/sign-in"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="(auth)/sign-up"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="(authenticated)"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}

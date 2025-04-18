import { useEffect, useState } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";

import { Href, Redirect } from "expo-router";

import { paths } from "@/lib/path";
import { useUserStore } from "@/stores/user-store";

export default function App() {
    const { token, user } = useUserStore();

    const [path, setPath] = useState<Href | null>(null);

    useEffect(() => {
        if (!token || !user) {
            console.log("Redirecting to sign in");
            setPath(paths.SIGN_IN);
        } else {
            if (user.type === "student") {
                setPath(paths.STUDENT.HOME);
            } else if (user.type === "teacher") {
                setPath(paths.TEACHER.HOME);
            }
        }
    }, [token, user]);

    if (path) {
        return <Redirect href={path} />;
    }

    return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" className="text-c-purple" />
        </SafeAreaView>
    );
}

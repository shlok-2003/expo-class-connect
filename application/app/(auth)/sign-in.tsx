import { useState } from "react";
import {
    Text,
    View,
    Alert,
    Pressable,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUserStore } from "@/stores/user-store";

import { cn } from "@/lib/utils";
import { paths } from "@/lib/path";

import { User } from "@/types";

const LOGIN_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth/login`;

export default function SignIn() {
    const { signIn } = useUserStore();

    const [userType, setUserType] = useState<"student" | "teacher">("student");
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSignIn = async () => {
        if (id === "" || password === "") {
            Toast.show({
                type: "error",
                text1: "Please fill in all fields",
                visibilityTime: 2000,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            console.log(LOGIN_URL);
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    college_id: id,
                    password,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            const user = data.user as User;
            const token = data.token as string;

            signIn(token, user);
            if (user.type === "student") {
                router.push(paths.STUDENT.HOME);
            } else if (user.type === "teacher") {
                router.push(paths.TEACHER.HOME);
            } else {
                throw new Error("Invalid user type");
            }

            Toast.show({
                type: "success",
                text1: "Sign in successful",
                visibilityTime: 2000,
            });
        } catch (error) {
            console.error(error);

            const message = (error as Error).message || "An error occurred";
            Alert.alert("Error", message, [
                {
                    text: "OK",
                    style: "cancel",
                },
            ]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View className="flex min-h-screen flex-1 items-center justify-center bg-c-purple">
                    <View className="w-11/12 max-w-md rounded-3xl bg-white p-6 shadow-lg">
                        <Text className="mb-6 text-center text-2xl font-bold text-c-purple">
                            Class Connect
                        </Text>

                        {/* Toggle Buttons */}
                        <View className="mb-6 flex-row rounded-lg bg-gray-100">
                            <Pressable
                                onPress={() => setUserType("student")}
                                className={cn(
                                    "flex-1 rounded-lg py-3",
                                    userType === "student"
                                        ? "bg-[#5B4B8A]"
                                        : "bg-transparent",
                                )}
                            >
                                <Text
                                    className={cn(
                                        "text-center font-semibold",
                                        userType === "student"
                                            ? "text-white"
                                            : "text-gray-600",
                                    )}
                                >
                                    Student
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setUserType("teacher")}
                                className={cn(
                                    "flex-1 rounded-lg py-3",
                                    userType === "teacher"
                                        ? "bg-[#5B4B8A]"
                                        : "bg-transparent",
                                )}
                            >
                                <Text
                                    className={cn(
                                        "text-center font-semibold",
                                        userType === "teacher"
                                            ? "text-white"
                                            : "text-gray-600",
                                    )}
                                >
                                    Teacher
                                </Text>
                            </Pressable>
                        </View>

                        {/* Username Input */}
                        <View
                            className="mb-4 overflow-hidden rounded-lg border border-gray-300"
                            style={{ borderWidth: 1, borderColor: "#5B4B8A" }}
                        >
                            <TextInput
                                className="flex-1 bg-white px-4 py-3"
                                placeholder={`${userType === "student" ? "Student" : "Teacher"} ID`}
                                value={id}
                                onChangeText={(text) => setId(text)}
                            />
                        </View>

                        {/* Password Input */}
                        <View
                            className="item-center mb-6 flex flex-row overflow-hidden rounded-lg border border-gray-300"
                            style={{ borderWidth: 1, borderColor: "#5B4B8A" }}
                        >
                            <TextInput
                                className="flex-1 bg-white px-4 py-3"
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity
                                onPress={() =>
                                    setIsPasswordVisible((prev) => !prev)
                                }
                                className="items-center justify-center pr-2"
                            >
                                {isPasswordVisible ? (
                                    <Ionicons
                                        name="eye"
                                        size={24}
                                        color="black"
                                    />
                                ) : (
                                    <Ionicons
                                        name="eye-off"
                                        size={24}
                                        color="black"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            className="mb-4 rounded-lg bg-[#5B4B8A] py-3"
                            onPress={handleSignIn}
                            disabled={isSubmitting}
                        >
                            <Text className="text-center font-semibold text-white">
                                {isSubmitting ? "Logging in..." : "Login"}
                            </Text>
                        </TouchableOpacity>

                        {/* Forgot Password */}
                        <View className="flex-row justify-center">
                            <Text className="text-gray-600">
                                Don't have an account?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push(paths.SIGN_UP)}
                                disabled={isSubmitting}
                            >
                                <Text className="font-semibold text-[#5B4B8A]">
                                    Sign up here
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

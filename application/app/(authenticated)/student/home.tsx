import { useState, useEffect } from "react";
import { Text, View, Alert, ScrollView, TouchableOpacity } from "react-native";

import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as LocalAuthentication from "expo-local-authentication";

import Clock from "@/components/clock";

import { cn, calculateDistance, parseUID } from "@/lib/utils";
import {
    disconnectSocket,
    fetchSocketURL,
    sendStudentDataToFlask,
} from "@/lib/function";

import { subjects } from "@/data/subjects";
import { teachers } from "@/data/teachers";

import { useUserStore } from "@/stores/user-store";

export default function Home() {
    const { user } = useUserStore();
    const [subject, setSubject] = useState("HCI");
    const [teacherInitials, setTeacherInitials] = useState("JJ");

    const [isJoining, setIsJoining] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [showJoin, setShowJoin] = useState(false);

    const [isConnected, setIsConnected] = useState(false);

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [teacherLocation, setTeacherLocation] = useState<{
        latitude: string;
        longitude: string;
    } | null>(null);

    const handleJoinSession = async () => {
        if (!user) return;

        setIsJoining(true);
        Toast.show({
            type: "info",
            text1: "Joining session...",
        });

        if (!socket) {
            return Alert.alert("Error", "Failed to connect to server");
        }

        if (!teacherLocation) {
            return Alert.alert("Error", "Teacher location not available");
        }

        try {
            const { name, college_id } = user;
            const { course, batch, rollNumber } = parseUID(college_id);

            const studentData = {
                user: user.type,
                name: name,
                rollno: rollNumber,
                uid: college_id,
                branch: course,
                division: batch,
                t_id: teacherInitials,
                lec_name: subject,
            };

            const dataToSend = {
                user: studentData.user,
                t_id: studentData.t_id.toUpperCase(),
                branch: studentData.branch,
                division: studentData.division,
                lec_name: studentData.lec_name.toUpperCase(),
                location: {
                    latitude: "",
                    longitude: "",
                },
            };

            const hasServices = await Location.hasServicesEnabledAsync();
            if (!hasServices) {
                await Location.enableNetworkProviderAsync();
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            dataToSend.location.latitude = location.coords.latitude.toString();
            dataToSend.location.longitude =
                location.coords.longitude.toString();

            console.log(dataToSend);

            const distance = calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                parseFloat(teacherLocation.latitude),
                parseFloat(teacherLocation.longitude),
            );

            const distanceCheck = distance <= 30; // 30 meters
            if (!distanceCheck) {
                Alert.alert("Error", "You are not in the range of the teacher");
                disconnectSocket(socket, setSocket);
            }

            const { success } = await LocalAuthentication.authenticateAsync({});

            if (!success) {
                Alert.alert("Error", "Unsuccessfull Authentication");
                disconnectSocket(socket, setSocket);
            }

            sendStudentDataToFlask(studentData, distanceCheck, success);
        } catch (error) {
            console.error(error);
        } finally {
            setIsJoining(false);
        }
    };

    const handleConnect = async () => {
        if (!user || isConnected) return;

        setIsConnecting(true);
        Toast.show({
            type: "info",
            text1: "Connecting to server...",
            visibilityTime: 2000,
        });

        try {
            const { name, college_id } = user!;
            const { course, batch, rollNumber } = parseUID(college_id);

            const studentData = {
                user: user.type,
                name: name,
                rollno: rollNumber,
                uid: college_id,
                branch: course,
                division: batch,
                t_id: teacherInitials,
                lec_name: subject,
            };

            const dataToSend = {
                user: studentData.user,
                t_id: studentData.t_id.toUpperCase(),
                branch: studentData.branch,
                division: studentData.division,
                lec_name: studentData.lec_name.toUpperCase(),
                location: {
                    latitude: "",
                    longitude: "",
                },
            };

            const hasServices = await Location.hasServicesEnabledAsync();
            if (!hasServices) {
                await Location.enableNetworkProviderAsync();
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            dataToSend.location.latitude = location.coords.latitude.toString();
            dataToSend.location.longitude =
                location.coords.longitude.toString();

            console.log(dataToSend);

            const socket_serverURL = await fetchSocketURL();
            const newSocket = new WebSocket(socket_serverURL);
            setSocket(newSocket);

            if (!newSocket) {
                return Alert.alert("Error", "Failed to connect to server");
            }

            newSocket.onopen = (event) => {
                console.log("Socket opened", event);
                newSocket.send(JSON.stringify(dataToSend));
                console.log("WebSocket established for student");

                Toast.show({
                    type: "success",
                    text1: "Connected to server",
                    visibilityTime: 2000,
                });
                setIsConnected(true);
            };

            newSocket.onmessage = async (event) => {
                console.log("Socket message", event);

                const serverMessage = JSON.parse(event.data);
                Toast.show({
                    type: "info",
                    text1: serverMessage.message,
                });

                if (serverMessage.message === "Attendance Started") {
                    setShowJoin(true);
                    setTeacherLocation(serverMessage.teacherLocation);
                } else if (serverMessage.message === "Teacher disconnected") {
                    setShowJoin(false);
                    setTeacherLocation(null);
                }
            };

            newSocket.onerror = (event) => {
                console.log("Error: ", event);
                disconnectSocket(newSocket, setSocket);
                setIsConnected(false);
            };

            newSocket.onclose = () => {
                disconnectSocket(newSocket, setSocket);
                setIsConnected(false);
            };
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Error",
                (error as Error).message || "Failed to connect to server",
            );
        } finally {
            setIsConnecting(false);
        }
    };

    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [socket]);

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 6,
                paddingTop: 6,
                position: "relative",
            }}
        >
            <Text className="rounded-lg bg-c-purple/50 px-2 py-1 text-2xl">
                Lecture Details
            </Text>

            <View className="mt-5 flex w-full flex-row gap-4 px-4">
                <View className="flex-1 overflow-hidden rounded-lg border border-black bg-c-purple">
                    <Picker
                        style={{
                            color: "white",
                            fontWeight: "700",
                        }}
                        dropdownIconColor="white"
                        onValueChange={(value: string) => {
                            setSubject(value);
                        }}
                        selectedValue={subject}
                    >
                        {subjects.map((subj) => (
                            <Picker.Item
                                style={{
                                    fontWeight: "700",
                                    backgroundColor:
                                        subject === subj
                                            ? "#5B4B8A"
                                            : "transparent",
                                }}
                                key={subj}
                                label={subj}
                                value={subj}
                            />
                        ))}
                    </Picker>
                </View>

                <View className="flex-1 overflow-hidden rounded-lg border border-black bg-c-purple">
                    <Picker
                        style={{ color: "white", fontWeight: "700" }}
                        dropdownIconColor="white"
                        onValueChange={(value: string) => {
                            setTeacherInitials(value);
                        }}
                        placeholder="Select Teacher Initials"
                        selectedValue={teacherInitials}
                    >
                        {teachers.map((t) => (
                            <Picker.Item
                                style={{
                                    fontWeight: "700",
                                    backgroundColor:
                                        teacherInitials === t
                                            ? "#5B4B8A"
                                            : "transparent",
                                }}
                                key={t}
                                label={t}
                                value={t}
                            />
                        ))}
                    </Picker>
                </View>
            </View>

            <Clock className="mt-10" />

            <View className="mt-16 flex flex-row gap-4">
                <TouchableOpacity
                    className={cn(
                        "h-48 w-48 items-center justify-center gap-4 rounded-full bg-c-purple pt-5 shadow-xl shadow-black",
                        isConnecting && "opacity-50",
                    )}
                    style={{ elevation: 10 }}
                    onPress={handleConnect}
                    disabled={isConnecting || isConnected}
                    activeOpacity={0.8}
                >
                    <FontAwesome
                        key="attendance button"
                        name="wifi"
                        size={50}
                        className="rotate-90"
                        color="white"
                    />
                    <View className="flex flex-col items-center justify-center gap-0">
                        <Text className="text-xl font-bold leading-none text-white">
                            Connect
                        </Text>
                    </View>
                </TouchableOpacity>

                {showJoin && (
                    <TouchableOpacity
                        className={cn(
                            "h-48 w-48 items-center justify-center gap-4 rounded-full bg-c-purple pt-5 shadow-xl shadow-black",
                            isJoining && "opacity-50",
                        )}
                        style={{ elevation: 10 }}
                        onPress={handleJoinSession}
                        disabled={isJoining}
                        activeOpacity={0.8}
                    >
                        <FontAwesome
                            key="attendance button"
                            name="wifi"
                            size={50}
                            className="rotate-90"
                            color="white"
                        />
                        <View className="flex flex-col items-center justify-center gap-0">
                            <Text className="text-xl font-bold leading-none text-white">
                                Join
                            </Text>
                            <Text className="text-xl font-bold leading-none text-white">
                                Session
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

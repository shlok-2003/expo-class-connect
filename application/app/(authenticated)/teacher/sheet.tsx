import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import { cn } from "@/lib/utils";
import { fetchteacherData } from "@/lib/function";

interface Attendance {
    roll_no: number;
    name: string;
}

export default function Sheet() {
    const {lectureId} = useLocalSearchParams<{ lectureId: string }>();

    // const [lectureId, setLectureId] = useState<string>("");
    const [data, setData] = useState<Attendance[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await fetchteacherData(lectureId);
                console.log("Response:", response);
                setData(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetch();
    }, [lectureId])

    if(!lectureId) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-lg font-bold text-black">
                    Lecture ID not found
                </Text>
            </View>
        );
    }

    console.log("Lecture ID:", lectureId);
    console.log("Data:", data);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <View className="flex-1">
                <View className="flex flex-col justify-between gap-2">
                    {/* <View className="mx-2 mb-5 mt-2 flex-row items-center justify-between gap-2 px-4">
                        <TextInput
                            className="flex-1 rounded-lg bg-white px-4 py-2 text-base font-bold text-black"
                            placeholder="Enter Lecture ID"
                            placeholderTextColor="#000000"
                            value={lectureId}
                            onChangeText={setLectureId}
                        />

                        <TouchableOpacity
                            className="rounded-lg bg-blue-500 px-4 py-2 text-base font-bold text-white"
                            activeOpacity={0.8}
                            onPress={fetch}
                        >
                            <Text className="text-base font-bold text-white">
                                Fetch
                            </Text>
                        </TouchableOpacity>
                    </View> */}

                    <View className="h-10 w-full flex-row items-center justify-between gap-2 bg-c-purple px-4">
                        <Text className="text-left text-lg font-medium text-white">
                            Roll No
                        </Text>
                        <Text className="flex-1 text-center text-lg font-medium text-white">
                            Student Name
                        </Text>
                        <Text className="text-right text-lg font-medium text-white">
                            Attendance
                        </Text>
                    </View>
                </View>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.roll_no.toString()}
                    keyboardShouldPersistTaps="handled" // 👈 Important
                    ItemSeparatorComponent={() => (
                        <View className="h-px bg-black" />
                    )}
                    renderItem={({ item }) => (
                        <View
                            className={cn(
                                "mx-2 my-1 flex-row items-center justify-between rounded-lg px-4 py-2",
                                "bg-green-500",
                            )}
                        >
                            <Text
                                className="text-left text-base font-bold text-white"
                                style={{ width: 45 }}
                            >
                                {item.roll_no}
                            </Text>
                            <Text className="flex-1 text-center text-base font-bold text-white">
                                {item.name}
                            </Text>
                            <Text
                                className="text-center text-base font-bold text-white"
                                style={{ width: 45 }}
                            >
                                P
                            </Text>
                        </View>
                    )}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

import { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import { cn } from "@/lib/utils";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
] as const;

const attendance = [
    { rollNo: 1, name: "John Doe", attendance: 1 },
    { rollNo: 2, name: "Jane Doe", attendance: 0 },
    { rollNo: 3, name: "John Smith", attendance: 1 },
    { rollNo: 4, name: "Jane Smith", attendance: 0 },
    { rollNo: 5, name: "John Doe", attendance: 1 },
];

export default function Sheet() {
    const [activeMonth, setActiveMonth] = useState<(typeof months)[number]>(
        months[0],
    );

    //TODO: in the setResult we need to calculate the percentage of attendance in the format 30/40

    const listHeaderComponent = useMemo(() => {
        return (
            <View className="items-center justify-center gap-2 pt-[6px]">
                <Text className="text-2xl">Mark Attendance</Text>

                <FlatList
                    data={months}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        gap: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className={cn(
                                "rounded-lg border border-black px-2 py-1",
                                activeMonth === item && "bg-c-purple",
                            )}
                            onPress={() => setActiveMonth(item)}
                            activeOpacity={0.8}
                        >
                            <Text
                                className={cn(
                                    "text-center text-lg font-bold",
                                    activeMonth === item && "text-white",
                                )}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                <View className="h-10 w-full flex-row items-center justify-between gap-2 bg-c-purple px-4">
                    <Text className="text-left text-lg font-medium text-white">
                        Subject
                    </Text>
                    <Text className="flex-1 text-center text-lg font-medium text-white">
                        Teacher
                    </Text>
                    <Text className="text-right text-lg font-medium text-white">
                        Theory / Prac
                    </Text>
                </View>
            </View>
        );
    }, [activeMonth]);

    return (
        <FlatList
            data={attendance}
            keyExtractor={(item) => item.rollNo.toString()}
            ItemSeparatorComponent={() => <View className="h-px bg-black" />}
            renderItem={({ item }) => (
                <View
                    className={cn(
                        "mx-2 my-1 flex-row items-center justify-between rounded-lg px-4 py-2",
                        item.attendance === 1 ? "bg-green-500" : "bg-red-600",
                    )}
                >
                    <Text
                        className="text-left text-base font-bold text-white"
                        style={{ width: 45 }}
                    >
                        {item.rollNo}
                    </Text>
                    <Text className="flex-1 text-center text-base font-bold text-white">
                        {item.name}
                    </Text>
                    <Text
                        className="text-center text-base font-bold text-white"
                        style={{ width: 45 }}
                    >
                        {item.attendance === 1 ? "P" : "A"}
                    </Text>
                </View>
            )}
            ListHeaderComponent={listHeaderComponent}
        />
    );
}

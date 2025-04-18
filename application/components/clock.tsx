import { useState, useEffect } from "react";
import { Text, View, ViewProps } from "react-native";

import { cn } from "@/lib/utils";

export default function Clock({ className, ...props }: ViewProps) {
    const [date, setDate] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);

        return () => clearInterval(timer);
    }, []);

    const timeString = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const dateString = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <View
            className={cn("flex items-center justify-center", className)}
            {...props}
        >
            <Text className="text-[70px] font-semibold text-black">
                {timeString}
            </Text>
            <Text className="text-xl text-black">{dateString}</Text>
        </View>
    );
}

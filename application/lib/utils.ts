import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * function to merge tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 *
 * Calculate the distance between student and teachers based on latitude and longitude.
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
) {
    const R = 6371000; // Earth's radius in meters
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance;
}

/**
 *
 * @param uid
 * @example
 * parseUID("21-COMPB44-25") // { joiningYear: 21, course: "COMP", batch: "B", rollNumber: 44, endYear: 25 }
 */
export function parseUID(uid: string) {
    const regex = /^(\d{2})-([A-Z]+)([A-Z])(\d{2})-(\d{2})$/;
    const match = uid.match(regex);

    if (!match) {
        throw new Error("Invalid UID");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, joiningYear, course, batch, rollNumber, endYear] = match;
    return {
        joiningYear: parseInt(joiningYear, 10),
        course,
        batch,
        rollNumber: parseInt(rollNumber, 10),
        endYear: parseInt(endYear, 10),
    };
}

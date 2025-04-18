export interface User {
    _id: string;
    name: string;
    email: string;
    type: "student" | "teacher";
    college_id: string;
    image: string;
}

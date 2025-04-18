import { Alert } from "react-native";

import Toast from "react-native-toast-message";

export const fetchSocketURL = async () => {
    try {
        const response = await fetch(
            "https://least-connections-gthjh7ddgtc0eqcs.centralindia-01.azurewebsites.net",
            {
                method: "GET",
                mode: "cors", // Ensure CORS is enabled
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        const data = await response.json(); // Wait for the response to be parsed
        console.log(`fetched : ${data.server}`);
        return data.server; // Return the server URL
    } catch (error) {
        console.error("Error fetching socket URL:", error);
        throw error;
    }
};

export const disconnectSocket = (
    socket: WebSocket,
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>,
) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
        setSocket(null);

        Toast.show({
            type: "error",
            text1: "Socket closed",
        })
    }
};

export const sendStudentDataToFlask = (
    studentData: any,
    DistanceCheck: boolean,
    BiometricCheck: boolean,
) => {
    if (DistanceCheck && BiometricCheck) {
        //forming the lecture_id (First 3 chars of UID + Branch + Div+ t_id + lec_name + last 3 chars of UID)

        const lectureId =
            studentData.uid.substring(0, 3) +
            studentData.branch +
            studentData.division +
            studentData.t_id +
            studentData.lec_name +
            studentData.uid.slice(-3);

        console.log("Lecture ID", lectureId);

        const dataToSend = {
            UID: studentData.uid,
            roll_no: studentData.rollno,
            name: studentData.name,
            branch: studentData.branch,
            division: studentData.division,
            lecture_id: lectureId,
            lecture_name: studentData.lec_name,
            teacher_initials: studentData.t_id.toUpperCase(),
        };

        // Sending data to Flask server
        //'https://flask-servers-gqazghgmg7hnbsgv.centralindia-01.azurewebsites.net/attendance_data'
        //'http://127.0.0.1:8080/round_robin'
        //'https://round-robin-d0b9f9dhbzcdbrgn.centralindia-01.azurewebsites.net/round_robin'
        fetch(
            "https://round-robin-d0b9f9dhbzcdbrgn.centralindia-01.azurewebsites.net/round_robin",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "validation",
                    data: dataToSend,
                }),
            },
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Error processing request") {
                    Alert.alert("Attendance Failed");
                } else {
                    console.log("Success:", data);
                    Alert.alert("Attendance Marked Succesfully");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                Alert.alert("Error sending student data");
            });
    }
};

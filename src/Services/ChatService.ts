import { Response } from "express";
import UserService from "./UserServices";
import prismaClient from "../db/prismaclient";
import { collection, addDoc, query, orderBy, limit, onSnapshot, getFirestore, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
const app = initializeApp({
    apiKey: "AIzaSyCq-G8y1jENXrT3ansHPxvBzYWS7Gt6BDk",
    authDomain: "easybuychat-e2938.firebaseapp.com",
    projectId: "easybuychat-e2938",
    storageBucket: "easybuychat-e2938.appspot.com",
    messagingSenderId: "787785893150",
    appId: "1:787785893150:web:8aa6c87e643cb8d85cb50f",
    measurementId: "G-1VB88C45PP"
})


class ChatService {
    public static async createOrGetRoom(participant1: number, participant2: number, res: Response) {

        if (participant1 == participant2) {
            return res.status(401).json({ message: "something is wrong." })
        }
        try {
            // Check if both participants exist and retrieve their IDs
            const participant1id = await prismaClient.user.findUnique({ where: { id: participant1 } })
            if (!participant1id) {
                return res.status(404).json({ message: "user not found." })
            }
            const participant2id = await prismaClient.user.findUnique({ where: { id: participant2 } })
            if (!participant2id) {
                return res.status(404).json({ message: "user not found." })
            }

            const existsroom = await prismaClient.chatRoom.findFirst({
                where: {
                    AND: [
                        { participants: { some: { id: participant1id.id } } },
                        { participants: { some: { id: participant2id.id } } }
                    ]
                }
            })

            if (existsroom) {
                return res.status(200).json({ message: "Room alrady Exists", roomid: existsroom.roomid })
            }


            const chatRef = collection(getFirestore(app), 'chats');
            const chatDocRef = await addDoc(chatRef, {
                participants: {
                    [participant1id.id]: true,
                    [participant2id.id]: true
                }
            });

            const roomidis = chatDocRef.id;
            // Create the room
            const newRoom = await prismaClient.chatRoom.create({
                data: {
                    roomid: roomidis,
                    participants: {
                        connect: [
                            { id: participant1id.id },
                            { id: participant2id.id }
                        ]
                    }
                }
            });

            return res.status(200).json({ message: "Room created successfully", roomid: newRoom.roomid });
        } catch (error: any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }


    }

    public static async isRoomalradyexist(participant1: number, participant2: number, res: Response) {
        try {
            const participant1id = await prismaClient.user.findUnique({ where: { id: participant1 } })
            if (!participant1id) {
                return res.status(404).json({ message: "user not found." })
            }
            const participant2id = await prismaClient.user.findUnique({ where: { id: participant2 } })
            if (!participant2id) {
                return res.status(404).json({ message: "user not found." })
            }

            const roomidis = participant1id.id + "room" + participant2id.id;

            const existsroom = await prismaClient.chatRoom.findFirst({
                where: {
                    AND: [
                        { participants: { some: { id: participant1id.id } } },
                        { participants: { some: { id: participant2id.id } } }
                    ]
                }
            })

            if (existsroom) {
                return res.status(200).json({ message: "Room alrady Exists", isExists: true, roomid: existsroom.roomid })
            } else {
                return res.status(200).json({ message: "Room Not Exists", isExists: false })
            }

        } catch (error: any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }

    public static async DeleteChat(userId: number, roomId: string, res: Response) {
        try {
            // Find the chat room by its roomId
            const chatRoom = await prismaClient.chatRoom.findFirst({
                where: { roomid: roomId },
                include: {
                    participants: true
                }
            });

            // If the chat room doesn't exist, return 404 Not Found
            if (!chatRoom) {
                return res.status(404).json({ message: "Chat room not found." });
            }

            const userExists = chatRoom.participants.some(participant => participant.id === userId);

            if (!userExists) {
                return res.status(404).json({ message: "User is not in the room's participants list.", isInRoom: false });
            }

            const firestore = getFirestore(app);
            const messagesCollectionRef = collection(firestore, `chats/${roomId}/messages`);
            await deleteDoc(doc(messagesCollectionRef));
            // console.log(messagesCollectionRef);
            

            // Delete the chat room
            await prismaClient.chatRoom.deleteMany({
                where: { roomid: roomId }
            });


            return res.status(200).json({ message: "Chat room deleted successfully." });
        } catch (error: any) {
            return res.status(500).json({ error: "Internal Server Error", errorMessage: error.message });
        }
    }


}

export default ChatService
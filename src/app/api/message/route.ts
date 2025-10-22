import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ConversationModel } from "@/models/Conversation";
import { DMessageModel } from "@/models/DMessage";
import mongoose from "mongoose";


export async function GET(req: NextRequest) {
    await connectToDatabase();

    try {
        const { searchParams } = new URL(req.url);
        const driverId = searchParams.get("driverId");
        const userId = searchParams.get("userId");

        if (!driverId || !userId) {
            return NextResponse.json(
                { error: "userId and driverId are required" },
                { status: 400 }
            );
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const driverObjectId = new mongoose.Types.ObjectId(driverId);

        // Find the conversation with both participants
        const conversation = await ConversationModel.findOne({
            participants: { $all: [userObjectId, driverObjectId] },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation not found" },
                { status: 404 }
            );
        }

        // Get messages for this conversation
        const messages = await DMessageModel.find({
            conversationId: conversation._id,
        }).sort({ createdAt: 1 }); // ascending order by time

        return NextResponse.json(
            { conversationId: conversation._id, messages },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ GET conversation/messages error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    await connectToDatabase();
    try {
        const body = await req.json();
        const { conversationId, senderId, receiverId, message } = body;

        if (!conversationId || !senderId || !receiverId || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newMessage = await DMessageModel.create({
            conversationId,
            senderId,
            receiverId,
            message,
        });

        // update conversation's last message
        await ConversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: message,
            updatedAt: Date.now(),
        });

        console.log(newMessage);

        return NextResponse.json(newMessage, { status: 201 });
    } catch (err) {
        console.error("❌ POST message error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

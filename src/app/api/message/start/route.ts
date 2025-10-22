import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConversationModel } from "@/models/Conversation";
import { DMessageModel } from "@/models/DMessage";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
    await connectToDatabase();

    try {
        const body = await req.json();
        const { driver, passenger, pickup, dropoff, date } = body;

        if (!driver || !passenger) {
            return NextResponse.json(
                { error: "Missing userId or otherUserId" },
                { status: 400 }
            );
        }

        const userObjectId = new mongoose.Types.ObjectId(driver);
        const otherObjectId = new mongoose.Types.ObjectId(passenger);

        // ✅ Check if conversation already exists
        let conversation = await ConversationModel.findOne({
            participants: { $all: [userObjectId, otherObjectId] },
        });

        // ✅ If not, create new conversation
        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [userObjectId, otherObjectId],
                lastMessage: "",
            });
        }

        // ✅ Create automatic first message
        const messageText = `🚗 Driver wants to contact you about - Pickup: ${pickup}, Dropoff: ${dropoff}, Date: ${date}`;

        const message = await DMessageModel.create({
            conversationId: conversation._id,
            senderId: userObjectId,
            receiverId: otherObjectId,
            message: messageText,
        });

        // ✅ Update conversation’s last message
        conversation.lastMessage = messageText;
        conversation.updatedAt = new Date();
        await conversation.save();

        return NextResponse.json(conversation);
    } catch (err) {
        console.log("❌ Error creating conversation:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
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
        console.log("DRIVER ID: ", driverId, typeof driverId)
        const userObjectId = new mongoose.Types.ObjectId(driverId);

        if (!driverId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const conversationsWithMessages = await ConversationModel.aggregate([
            {
                $match: {
                    participants: { $in: [userObjectId] },
                },
            },
            // Lookup users for participants
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participantDetails",
                },
            },
            // Map only _id and name to participants
            {
                $addFields: {
                    participants: {
                        $map: {
                            input: "$participantDetails",
                            as: "p",
                            in: { _id: "$$p._id", name: "$$p.name" },
                        },
                    },
                },
            },
            // Remove temporary participantDetails field
            { $unset: "participantDetails" },
            // Join messages
            {
                $lookup: {
                    from: "dmessages",
                    localField: "_id",
                    foreignField: "conversationId",
                    as: "messages",
                },
            },
            { $sort: { updatedAt: -1 } },
        ]);

        return NextResponse.json(conversationsWithMessages, { status: 200 });
    } catch (err) {
        console.error("❌ GET messages error:", err);
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

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ConversationModel } from "@/models/Conversation";
import { DMessageModel } from "@/models/DMessage";

export async function GET(req: NextRequest) {
    await connectToDatabase();
    try {
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get("conversationId");
        if (!conversationId) {
            return NextResponse.json(
                { error: "conversationId is required" },
                { status: 400 }
            );
        }

        const messages = await DMessageModel.find({ conversationId }).sort({
            createdAt: 1,
        }); // oldest → newest

        const conversation = await ConversationModel.findById(conversationId);

        return NextResponse.json({ messages, conversation }, { status: 200 });
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

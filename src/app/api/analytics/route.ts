import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { db } = await connectToDatabase();

    const timestamp = new Date();

    if (data.type === "session_start") {
      await db.collection("visitor_sessions").updateOne(
        { visitorId: data.metadata.visitorId },
        {
          $set: {
            ...data.metadata,
            lastSeen: timestamp,
          },
          $setOnInsert: { firstSeen: timestamp },
        },
        { upsert: true },
      );
    } else if (data.type === "tracking_snapshot") {
      await db.collection("tracking_snapshots").insertOne({
        visitorId: data.visitorId,
        snapshot: data.snapshot, // Base64 image
        trackingState: data.trackingState,
        timestamp: timestamp,
        path: data.path,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Analytics] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const sessions = await db
      .collection("visitor_sessions")
      .find({})
      .sort({ lastSeen: -1 })
      .limit(50)
      .toArray();

    const snapshots = await db
      .collection("tracking_snapshots")
      .find({})
      .sort({ timestamp: -1 })
      .limit(1000)
      .toArray();

    return NextResponse.json({ sessions, snapshots });
  } catch (err) {
    console.error("[API Analytics GET] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    const { ids } = data;
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const objectIds = ids.map((id: string) => new ObjectId(id));

    await db.collection("tracking_snapshots").deleteMany({
      _id: { $in: objectIds },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Analytics DELETE] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}


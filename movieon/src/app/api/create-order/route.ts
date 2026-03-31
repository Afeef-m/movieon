//movieon\src\app\api\create-order\route.ts

import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    if (!body.amount || !body.currency) {
      return NextResponse.json(
        { error: "Missing required fields: amount, currency" },
        { status: 400 }
      );
    }

    // Check environment variables
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Missing Razorpay credentials in environment variables");
      return NextResponse.json(
        { error: "Razorpay configuration error" },
        { status: 500 }
      );
    }

    console.log("Creating Razorpay order with amount:", body.amount);

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: body.amount,
      currency: body.currency,
      receipt: "receipt_" + Date.now(),
    });

    console.log("Order created successfully:", order.id);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to create order", 
        details: error.message || "Unknown error" 
      },
      { status: 500 }
    );
  }
}
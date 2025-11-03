// Helper Libs
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

// Extract Details From Token
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token)
            return NextResponse.json({ message: "Token Not Found!" }, { status: 404 });

        const { email } = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; };

        return NextResponse.json({ email: email }, { status: 200 });
    } catch (error) {
        console.error(`Error fetching token details - ${error}`);
        if (error instanceof Error)
            return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
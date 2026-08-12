import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailers";

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (typeof username !== "string" || username.trim().length < 2) {
      return NextResponse.json(
        { error: "Username must be at least 2 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: "This email is already registered" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    try {
      await sendEmail({ email: savedUser.email, emailType: "VERIFY", userId: savedUser._id });
    } catch (emailError: any) {
      console.error("Failed to send verification email:", emailError.message);
    }

    return NextResponse.json({
      message: "Account created successfully! Please check your email to verify your account.",
      success: true,
      savedUser: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      return NextResponse.json(
        { error: `This ${field} is already registered` },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

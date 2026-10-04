import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(req: NextRequest){
    try {
        const videos = await prisma.video.findMany({
            orderBy:{
                createdAt: "desc"
            }
        })
        return NextResponse.json({videos}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Error Fetching Videos"}, {status: 500});
    }
    finally {
        await prisma.$disconnect();
    }
}
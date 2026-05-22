import { NextResponse } from "next/server";
export function GET() { return NextResponse.json({ status: "ready", checks: { next: true, prismaSchema: true, storageMock: true } }); }

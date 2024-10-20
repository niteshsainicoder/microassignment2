import Data from "@/models/data";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log( request.headers.get('Cookie'));
     await dbConnect();
  const data = {
    Day: 44838,
    Age: ">25",
    Gender: "Male",
    A: 631,
    B: 231,
    C: 485,
    D: 759,

    E: 314,
    F: 570,
  };

  const insert = await Data.create(data);

  console.log(insert);
  return NextResponse.json(
    { message: "Data saved successfully" },
    { status: 201 }
  );
}

// app/api/data/route.ts

import Data from "@/models/data"; // Adjust the import path as needed
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

interface MatchConditions {
  $match: {
    [key: string]: any;
  };
}
// GET route to fetch data with filters
export async function GET(req: NextRequest) {
  await dbConnect();
  
  const url = new URL(req.url);
  const age = url.searchParams.get("age");
  const gender = url.searchParams.get("gender");
  const startDate = url.searchParams.get("startDate"); // Assuming Day is a number
  const endDate = url.searchParams.get("endDate");

  // Build match conditions based on the provided filters
  const matchConditions: MatchConditions = {
    $match: {}
  };

  const start = startDate ? Number(startDate) : undefined;
  const end = endDate ? Number(endDate) : undefined;


  // Add filters to the match conditions
  if (age) matchConditions.$match.Age = age;
  if (gender) matchConditions.$match.Gender = gender;
  if (start && end) {
    matchConditions.$match.Day = { $gte: start, $lte: end };
  }

  console.log(matchConditions, 'matchConditions');
  // Define the aggregation pipeline
  const aggregationPipeline = [
    matchConditions,
    {
      $group: {
        _id: { Age: "$Age", Gender: "$Gender" },
        totalA: { $sum: "$A" },
        totalB: { $sum: "$B" },
        totalC: { $sum: "$C" },
        totalD: { $sum: "$D" },
        totalE: { $sum: "$E" },
        totalF: { $sum: "$F" },
        averageA: { $avg: "$A" },
        averageB: { $avg: "$B" },
        averageC: { $avg: "$C" },
        averageD: { $avg: "$D" },
        averageE: { $avg: "$E" },
        averageF: { $avg: "$F" }
      }
    }
  ];

  try {
    // Execute the aggregation
    const data = await Data.aggregate(aggregationPipeline);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

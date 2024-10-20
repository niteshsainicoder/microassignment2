// app/api/data/route.ts

import Data from "@/models/data"; // Adjust the import path as needed
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

interface MatchConditions {
  $match: {
    Age?: string;
    Gender?: string;
    Day?: { $gte: number; $lte: number };
  };
}

// Define the expected response type from the database
interface AggregatedData {
  _id: {
    Age: string;
    Gender: string;
  };
  totalA: number;
  totalB: number;
  totalC: number;
  totalD: number;
  totalE: number;
  totalF: number;
  averageA: number;
  averageB: number;
  averageC: number;
  averageD: number;
  averageE: number;
  averageF: number;
}

// GET route to fetch data with filters
export async function GET(req: NextRequest): Promise<NextResponse> {
  await dbConnect();

  const url = new URL(req.url);
  const age = url.searchParams.get("age");
  const gender = url.searchParams.get("gender");
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  // Log received filters
  console.log("Received filters:", { age, gender, startDate, endDate });

  // Build match conditions based on the provided filters
  const matchConditions: MatchConditions = {
    $match: {}
  };

  // Safely parse and check the filter values
  const start = startDate ? Number(startDate) : undefined;
  const end = endDate ? Number(endDate) : undefined;

  // Add filters to the match conditions
  if (age) matchConditions.$match.Age = age;
  if (gender) matchConditions.$match.Gender = gender;
  if (start !== undefined && end !== undefined) {
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
    const data: AggregatedData[] = await Data.aggregate(aggregationPipeline);
    
    // Log the aggregated data
    console.log("Aggregated data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

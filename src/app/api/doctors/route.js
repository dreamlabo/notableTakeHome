import { NextResponse } from "next/server";
import Doctor from "@/models/doctor"


// Create a doctor
export async function POST(req) {
    const requestData = await req.json();
    

    try {
        const data = {
            firstName: requestData.firstName,
            lastName: requestData.lastName,
        }

        const newDoctor = await Doctor.create(data);

        return NextResponse.json({
            message: "Doctor created", 
            doctor: newDoctor}, 
            { status: 201})
       
    } catch (error) {
        console.log("failed to create doctor", error)
        return NextResponse.json({message: "Error", error}, { status: 500})
    }
}


// Get a list of all doctors
export async function GET(req) {
    try {
        const allDoctors = await Doctor.find().sort({firstName: 'asc'})
        return NextResponse.json({
            doctors: allDoctors}, 
            { status: 200})
    }
    catch(error) {
        return NextResponse.json({message: "Error", error}, { status: 500})
    }
}

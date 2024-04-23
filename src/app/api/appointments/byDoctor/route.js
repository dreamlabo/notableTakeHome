
import { NextResponse } from "next/server";
import Appointment from "@/models/appointment"

// Get a list of all appointments for a particular doctor and particular day
export async function GET(req) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams)
    const doctorId = searchParams.get("doctorId")
   
    const startDate = new Date(searchParams.get("date"))
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + 1);
   
    try {
        const appointmentsByDoctorOnGivenDate = await Appointment.find({
              date: {
                $gte: startDate,
                $lt: nextDay
            },
            withDoctor: doctorId
        });

        if(appointmentsByDoctorOnGivenDate.length === 0) {
            return NextResponse.json({message: "No appointments found with given data"}, { status: 200})
        }
        return NextResponse.json({appointments: appointmentsByDoctorOnGivenDate}, { status: 200})

    } catch (error) {
        return NextResponse.json({message: "Error", error}, { status: 500})
    }
}
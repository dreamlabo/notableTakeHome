import { NextResponse } from "next/server";
import Appointment from "@/models/appointment"
import Appointments from "@/models/appointment";


// Get all appointments by all doctors
export async function GET(req) {
    try {
        const allAppointments = await Appointment.find()
        return NextResponse.json({allAppointments: allAppointments}, {status: 200})
    }
    catch(error) {
        return NextResponse.json({message: "Error", error}, { status: 500})
    }
}

// Add a new appointment to a doctor's calendar
export async function POST(req) {
    const requestData = await req.json();

    // check time is ok
    // New appointments can only start at 15 minute intervals (ie, 8:15AM is a valid time
    // but 8:20AM is not)
    const date = new Date(requestData.date)
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
 
    if(seconds !== 0 || (minutes % 15 !== 0)) {
        return NextResponse.json({message: "Appointment must be on the quarter hour."}, { status: 400})
    }

    // check the appoint time doesn't already have three appointments
    // A doctor can have multiple appointments with the same time, but no more than 3
    // appointments can be added with the same time for a given doctor
    try { 
        const appointmentsByTime = await Appointment.find({
                    date: new Date(requestData.date),
                    withDoctor: requestData.withDoctor,
                })

        if(appointmentsByTime.length >= 3) {
            return NextResponse.json({message: "Can only schedule a max of three appointments at any given time for a given doctor."}, { status: 400})
        }

    }catch(error) {
        return NextResponse.json({message: "Error", error}, { status: 500})
    }
      
    // If everything is good, create the new record
    try {
        const data = {
            withDoctor: requestData.withDoctor,
            date: new Date(requestData.date),
            patientFirstName: requestData.patientFirstName,
            patientLastName: requestData.patientLastName,
            kind: requestData.kind
        }

        const newAppointment = await Appointment.create(data);
        
        return NextResponse.json({
            message: "Appointment created", 
            appointment: newAppointment}, 
            { status: 201})
       
    } catch (error) {
        console.log("failed to create appointment", error)
        return NextResponse.json({message: "Error", error}, { status: 500})
    }
}
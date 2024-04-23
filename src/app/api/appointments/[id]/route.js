import { NextResponse } from "next/server";
import Appointment from "@/models/appointment"

// Delete an existing appointment from a doctor's calendar
// This deletes by the ObjectId that MongoDb creates
export async function DELETE(req, {params}) {
    console.log(params)
    try {
        await Appointment.deleteOne({
            _id: params.id
        })
        return NextResponse.json({deleted: true},{ status: 200})
    }
    catch(error){
        return NextResponse.json({ status: 500})
    }
}
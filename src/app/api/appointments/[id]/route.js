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

export async function PUT(req, {params}) {
    const id = params.id;
    const requestData = await req.json();
    // const newData = requestData.patientFirstName;
    console.log(id, requestData)

    try {
        const updatedAppt = await Appointment.findOneAndUpdate({
            _id: id
        },{
            $set: requestData
        },
        {
            returnOriginal: false
        })

        console.log("new:", updatedAppt)
        return NextResponse.json(
            {
                updatedAppt: updatedAppt
            },
            { 
                status: 200
            }
    
        )
    }
    catch(error){
        return NextResponse.json({status: 500, message: "Update failed"})
    // return NextResponse.json({status: 500, message: "Update failed"})
    }
    // return NextResponse.json({status: 500, message: "Update failed"})
}
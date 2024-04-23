
import { NextResponse } from "next/server";
import Doctor from "@/models/doctor"

export async function DELETE(req, {params}) {
    console.log(params)
    try {
        await Doctor.deleteOne({
            _id: params.id
        })
        return NextResponse.json({deleted: true},{ status: 200})
    }
    catch(error){
        return NextResponse.json({ status: 500})
    }
}

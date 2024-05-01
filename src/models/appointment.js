import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const appointmentSchema = new Schema(
    {
        date: {type: Date, 
                trim: true, 
                required: true
            },
        withDoctor: {type: String, 
                    trim: true, 
                    required: true
        },
        patientFirstName: {type: String, 
            trim: true, 
            required: true
        },
        patientLastName: {type: String, 
            trim: true, 
            required: true
        },
        kind: {
            type: String,
            enum: ["New Patient",
                    "Follow-up",
                ],
            required: true,
        },
    },
    {
      timestamps: true,
    }
  );
  
  const Appointments = mongoose.models.Appointments || mongoose.model("Appointments", appointmentSchema);
  
  export default Appointments;
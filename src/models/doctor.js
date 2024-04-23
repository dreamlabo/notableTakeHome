import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const doctorSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
                type: String,
                required: true,
                trim: true
            },
        },
    {
      timestamps: true,
    }
  );
  
  const Doctors = mongoose.models.Doctors || mongoose.model("Doctors", doctorSchema);
  
  export default Doctors;
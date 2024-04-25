import mongoose, {Schema, Document} from "mongoose";

/***************************************
                USER SCHEMA
****************************************/

export interface User extends Document{
    username: string;
    dateOfBirth: Date;
    apiCalled: number;
}

const userSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Date of Birth is required"]
        },
        apiCalled: {
            type: Number,
            default: 1
        }
    }
);

const userModel = 
    (
        mongoose.models.User as mongoose.Model<User>
    )
    ||
    (
        mongoose.model<User>("User", userSchema)
    )

export default userModel;
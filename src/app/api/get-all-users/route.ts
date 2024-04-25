import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";

export async function GET(request: Request) {
    await dbConnect();

    try {
        const allUsers = await userModel.find({});

        if(allUsers){
            return Response.json(
                {
                    success: true,
                    message: "All users fetched successfully",
                    users: allUsers
                },
                {
                    status: 200
                }
            )
        }
    } catch (error) {
        console.error(`Error in fetching all users`);
        return Response.json(
            {
                success: false,
                message: "Error in fetching all the users"
            },
            {
                status: 500
            }
        )
        
    }
}
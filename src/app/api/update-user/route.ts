import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";


export async function POST(request: Request) {
    await dbConnect();

    const {username, DOB} = await request.json();

    try {
        const user = await userModel.findOne(
            {
                username
            }
        );

        if(user){
            const response = await userModel.findOneAndUpdate(
                {username},
                {
                    $set: { 
                        dateOfBirth: DOB 
                    },
                    $inc: {
                        apiCalled: 1
                    }
                
                },

                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            );

            console.log(`New user - ${JSON.stringify(response)}`);


            return Response.json(
                {
                    success: true,
                    message: "User udpated successfully",
                    user: response
                },
                {
                    status: 200
                }
            );
        }
            
        return Response.json(
            {
                success: false,
                message: "User not found"
            },
            {
                status: 404
            }
        )
        
    } catch (error) {
        console.error("Error in updating user details", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong while updating user details"
            },
            {
                status: 500
            }
        )
           
    }
}   
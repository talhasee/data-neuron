import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";

export async function GET(request: Request){
    await dbConnect();
    
    try {
        const{searchParams} = new URL(request.url);
        const username = searchParams.get('username');
        // const {username} = await request.json();
        const user = await userModel.findOne(
            {
                username
            }
        );

        if(user){
            console.log(`User - ${JSON.stringify(user)}`);

            const apiCalledCount = user.apiCalled;

            return Response.json(
                {
                    success: true,
                    message: "User api called count fetched successfully",
                    count: apiCalledCount
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
                message: "Something went wrong while finding user details"
            },
            {
                status: 500
            }
        )
           
    }
}
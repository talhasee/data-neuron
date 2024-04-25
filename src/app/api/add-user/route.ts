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
                    message: "User Added successfully",
                    user: response
                },
                {
                    status: 200
                }
            )

        }else{
            const newUser = new userModel(
                {
                    username,
                    dateOfBirth: DOB,
                    apiCalled: 1
                }
            );

            console.log(`newUser - ${JSON.stringify(newUser)}`);
            

            const response = await newUser.save();

            if(!response){
                return Response.json(
                    {
                        success: false,
                        message: "Error in saving new user"
                    },
                    {
                        status: 500
                    }
                )
            }

            console.log(`New user - ${JSON.stringify(response)}`);
            

            return Response.json(
                {
                    success: true,
                    message: "User added successfully",
                    user: response
                },
                {
                    status: 201
                }
            )
        }

       

    } catch (error) {
        console.error("Error in adding user details", error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong while adding user"
            },
            {
                status: 500
            }
        )
           
    }
}
"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import {Spinner} from "@nextui-org/spinner";
 
// Define the type for user data
type User = {
  username: string;
  DOB: string;
  apiCalled: number;
 };
 

export default function Home() {

  //State Variable for handling username and DOB
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');

  //State Variable for handling visibilty of alert dialog
  const [alert, setAlert] = useState(false);

  //State variables for handling Alert Dialog header and Message
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  //Sample object in userData for table
  const [userData, setUserData] = useState<User[]>([]);

  //Loading state variable
  const [loading, setLoading] = useState(false);

  let executed = false;

  //Fetching all the users on intial page render
  useEffect( () => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/get-all-users`);

        const users = response.data.users;

        for(let i = 0; i < users.length; i++){
          const temp = users[i];

          const isoDate = temp.dateOfBirth;
          const dateObject = new Date(isoDate);
          const formattedDate = dateObject.toISOString().slice(0, 10);
          const newUser = {
            username: temp.username,
            DOB: formattedDate,
            apiCalled: temp.apiCalled
          }
          setUserData(prevData => [...prevData, newUser]);

        }
        

      } catch (error) {
        console.error(`Error in fetching all users`);
      }finally{
        setLoading(false);
      }
    }
    if(!executed){
      fetchAllUsers();
      executed = true;
    }
  },[])


  //Finding existence of any object ini userData array
  const findUser = (username: string) => userData.find(user => user.username === username);

  //Function for handling adding new user to Database
  const handleAddEntry = async () => {

    if (username && dob) {
      //Date conversion to YYYY-MM-DD format
      const formattedDob = new Date(dob).toISOString().slice(0,10);
      console.log('Username:', username);
      console.log('Date of Birth:', formattedDob);

      try {
        const response = await axios.post('/api/add-user', 
          {
            username: username,
            DOB: formattedDob
          }
        );
        // console.log(`RESPONSE - ${JSON.stringify(response)}`);

        //New user object
        const newUser = {
          username: response.data.user.username,
          DOB: formattedDob,
          apiCalled: response.data.user.apiCalled
        }

        const existingUser = findUser(username);
        if(existingUser){
          setUserData(prevData => prevData.map(user => user.username === username ? newUser : user));
        }
        else{
          setUserData(prevData => [...prevData, newUser]);
        }


      } catch (error) {
        console.error(`Error in registering user - ${error}`);   
        setAlert(true);
        setAlertHeader("Error in Adding User")
        setAlertMessage(`Error in adding user. Please try again later!!!`);
      }
    }
    else{
      setAlert(true);
      setAlertHeader("Invalid Input")
      setAlertMessage(`Error in adding user. Please check your input!!`);
    }
  }

  //Function for handling user details updation
  const updateUserDetails = async () => {
    if (username && dob) {
      const formattedDob = new Date(dob).toISOString().slice(0,10);
      console.log('Username:', username);
      console.log('Date of Birth:', formattedDob);

      try {
        const response = await axios.post('/api/update-user', 
          {
            username: username,
            DOB: formattedDob
          }
        );
        
        //New User Object after updation
        const newUser = {
          username: response.data.user.username,
          DOB: formattedDob,
          apiCalled: response.data.user.apiCalled
        }

        const existingUser = findUser(username);
        if(existingUser){
          setUserData(prevData => prevData.map(user => user.username === username ? newUser : user));
        }
        else{
          setUserData(prevData => [...prevData, newUser]);
        }

      } catch (error) {
        console.error(`Error in registering user - ${error}`);   
        setAlert(true);
        setAlertHeader("User Not Found!!!!")
        setAlertMessage("User does not exists please add this user first.");
      }
    }
    else{
      setAlert(true);
      setAlertHeader("Invalid Input")
      setAlertMessage(`Error in updating user details. Please check your input!!`);
    }
  }

  //Function for handling getting user's Api Called Count
  const getUserApiCalledCount = async () => {
    if(username){
      
      try {
        const response = await axios.get(`/api/api-called-count?username=${username}`);

        setAlert(true);
        setAlertHeader(`Found user with username - ${username}`);
        setAlertMessage(`Api Called count for user with username '${username}' is ${response.data.count}`);

      } catch (error) {
        console.error(`Error in getting api called count - ${error}`);
        setAlert(true);
        setAlertHeader("User Not Found!!!!")
        setAlertMessage("User does not exists please add this user first to get api called count");
      }

    }
    else{
      setAlert(true);
      setAlertHeader("Invalid Input")
      setAlertMessage(`Error in fetching user API called count. Please check your input!!`);
    }
  }
 
  return (
    <div className="flex justify-center items-center h-screen bg-stone-600">
      <div className="m-4 w-3/4 h-3/4 bg-gray-300">
        <ResizablePanelGroup
          direction="vertical"
          className="bg-fuchsia-600"
        >
          {/* {***********UI FOR 3 RESIZABLE DIV*****************} */}
          <ResizablePanel defaultSize={50} maxSize={70} >
            <ResizablePanelGroup direction="horizontal" >
              <ResizablePanel defaultSize={25} maxSize={60} >
                <div className="flex h-full items-center justify-center p-6 bg-purple-700">

                  <div className="m-2 w-full h-full max-w-[800px] overflow-y-auto">
                    {
                      loading && <Spinner color="warning"/>
                    }
                    <Table className="w-full ">
                      <TableCaption className="text-white font-bold">A list of user details.</TableCaption>
                      <TableHeader>
                        <TableRow >
                          <TableHead className="w-[100px] text-gray-900 font-extrabold">Username</TableHead>
                          <TableHead className="text-gray-900 font-extrabold">Date of Birth</TableHead>
                          <TableHead className="text-gray-900 font-extrabold">Api Called Count</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-white font-bold">
                        {userData.map((user) => (
                          <TableRow key={user.username}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.DOB}</TableCell>
                            <TableCell>{user.apiCalled}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={60} maxSize={80}>
                <div className="flex h-full items-center justify-center p-6 bg-rose-800">
                <div className="m-2 w-full h-full max-w-[800px] overflow-y-auto">
                    {
                      loading && <Spinner color="warning"/>
                    }
                    <Table className="w-full ">
                      <TableCaption className="text-white font-bold">A list of user details.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px] text-gray-900 font-extrabold">Username</TableHead>
                          <TableHead className="text-gray-900 font-extrabold">Date of Birth</TableHead>
                          <TableHead className="text-gray-900 font-extrabold">Api Called Count</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-white font-bold">
                        {userData.map((user) => (
                          <TableRow key={user.username}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.DOB}</TableCell>
                            <TableCell>{user.apiCalled}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} maxSize={70}>
            <div className="flex h-full items-center justify-center p-6 bg-orange-900">
            <div className="m-2 w-full h-full max-w-[800px] overflow-y-auto">
              {
                loading && <Spinner color="warning"/>
              }
              <Table className="w-full ">
                <TableCaption className="text-white font-bold">A list of user details.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-gray-900 font-extrabold">Username</TableHead>
                    <TableHead className="text-gray-900 font-extrabold">Date of Birth</TableHead>
                    <TableHead className="text-gray-900 font-extrabold">Api Called Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-white">
                  {userData.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell >{user.DOB}</TableCell>
                      <TableCell>{user.apiCalled}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
              {/* <span className="font-semibold">Three</span> */}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/*************SIDE DRAWER FOR ADDING USER DETAILS AS INPUT********************** */}
      <div className="flex flex-col gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button >Add</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add User</SheetTitle>
              <SheetDescription>
                Add User details to add a new user.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Username
                </Label>
                <Input id="name" className="col-span-3" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Date of Birth
                </Label>
                {/* <Input id="username" className="col-span-3" /> */}
                <input type="date" id="dob" className="col-span-3 border border-black rounded-sm" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={handleAddEntry}>Add Entry</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>


        {/*************SIDE DRAWER FOR UPDATING USER DETAILS AS INPUT******************** */}


        <Sheet>
          <SheetTrigger asChild>
            <Button >Update</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Update User</SheetTitle>
              <SheetDescription>
                Update user details by giving username
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Username
                </Label>
                <Input id="name" className="col-span-3" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Date of Birth
                </Label>
                {/* <Input id="username" className="col-span-3" /> */}
                <input type="date" id="dob" className="col-span-3 border border-black rounded-sm" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={updateUserDetails}>Add Entry</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

{/*************SIDE DRAWER FOR GETTING API CALLED COUNT OF ANY USER ********************** */}

        <Sheet>
          <SheetTrigger asChild>
            <Button >Count</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Api Called Count</SheetTitle>
              <SheetDescription>
                Get API called count of any user using their username
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Username
                </Label>
                <Input id="name" className="col-span-3" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={getUserApiCalledCount} >Get Count</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
                
{/*************CONDITIONALLY SHOWING ALERT BOX FOR ERROR AND RESPONSE MESSAGES********************** */}

        {alert &&
          <AlertDialog open={alert} onOpenChange={setAlert} >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{alertHeader}</AlertDialogTitle>
                <AlertDialogDescription>
                  {alertMessage}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction >OK</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }

        </div>
    
    </div>
  );
}

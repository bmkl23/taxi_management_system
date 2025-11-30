This is a full-stack Taxi Booking Platform built with a Node.js backend and a React frontend.  The system allows admins to manage drivers and users to book taxis with real-time updates.

---------------------------------------------------------------------------

System Overview (User Story Flow)

User 

Guest visits the Home Page.
He tries to book a tour.
The system checks and finds he is not registered.
Guest clicks the Register button and completes the registration.
He is redirected to the Taxi Booking page.
The pickup location is auto-filled as “Hotel XXX”.
User searches and selects the destination on the map.

The map displays:
Route
Distance (KM)
Time (Minutes / Hours)
Estimated Fare (Rs)
User clicks the “Confirm Tour” button.

The backend saves the booking with status: DRIVER_PENDING.

If no drivers are available, the system shows:
“We are unable to assign a driver at the moment.”

--------------------------------------------------------
Driver Flow (Amal)

Driver Login

Drivers do not self-register.
Only the Admin can register drivers.
After login, Amal sees the pending booking requests.

Driver Status Logic
Driver status changes automatically based on actions:

Driver Action System Status
Driver logs in available
Driver accepts a booking busy
Driver completes a trip	available
Driver logs out or closes the app offline
Example Status Update API


Accept / Reject Flow

Accept
Booking status becomes CONFIRMED.
Driver can view booking details.
Driver can call Passenger ( user ) 
After reaching the destination, Amal marks the trip as Finished.

Reject - The system assigns the booking to the next available driver.

------------------------------------------------------------

Admin Flow )

Admin login provides access to:
Dashboard
Tour History
User Table
Driver Table

Admin can perform the following actions:

Add, edit, or delete users
Add, edit, or delete drivers
Monitor all bookings
Check driver availability
View complete trip history


---------------------------------------------

Technologies Used


Frontend

React.js
Tailwind CSS
Axios
React Router

Backend

Node.js
Express.js
MongoDB
Mongoose
Socket.io

---------------------------------------------------------------

Folder Structure 

project-folder/
   ├── lw_taxi_backend/
   └── lw_taxi_frontend/


-------------------------------------

How to Run 

Backend   :  node server.js ( nodemon /Optional ) 
Frontend  :  npm run dev
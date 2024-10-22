import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
}

const connection: ConnectionObject = {}; // In the connectionObject interface, since we have kept isConnected optional, that is why we are able to keep , this connection variable empty.

// Promise<void>
// Promise: This indicates that the function is asynchronous and will return a promise.
// void: This indicates that the promise, when resolved, does not return any value.
async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		console.log("Already Connected to database.");
		return;
	}
	try {
		const db = await mongoose.connect(process.env.MONGODB_URI || "", {});  // either use the uri in env or take it as empty string, that will be handeled by the catch block, the '{}' can have additional option, which  we have not given here.

		console.log(db);

		connection.isConnected = db.connections[0].readyState;

		console.log("DB connected successfully");
	} catch (error) {
		console.log("Database connection failed", error);
		process.exit(1);
	}
}

export default dbConnect;

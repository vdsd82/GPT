// pages/api/incrementLikes.js

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Your MongoDB connection string
const dbName = "GPT-Combined";

export default async function handler(req, res) {
  // Ensure we're dealing with a POST request
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed, only POST requests are allowed." });
  }

  const { web_id } = req.body; // Expecting 'web_id' in the body of the request

  if (!web_id) {
    return res.status(400).json({ error: "web_id is required" });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection("CombinedData");

    // Convert web_id to the correct type if necessary (e.g., to an integer or ObjectId)
    const query = { web_id: parseInt(web_id) };
    const updateDoc = {
      $inc: { likes: 1 }, // Increment 'likes' field by 1
    };

    // Perform the update operation
    const result = await collection.updateOne(query, updateDoc);

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "Document not found or likes already incremented" });
    }

    res.status(200).json({ message: "Likes incremented by 1", web_id: web_id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to increment likes", details: error.message });
  } finally {
    await client.close();
  }
}

// pages/api/randomDocuments.js

import { MongoClient } from "mongodb";
import cache from "memory-cache"; // Import the memory-cache package

const uri = process.env.MONGODB_URI; // Your MongoDB connection string
const dbName = "GPT-Combined";

export default async function handler(req, res) {
  const { web_id, all, searchTerm } = req.query; // Get web_id, all, and searchTerm from query parameters

  // Create a unique cache key based on the request
  const cacheKey = web_id || all || searchTerm || "random";
  const cachedData = cache.get(cacheKey); // Try to retrieve cached data

  if (cachedData) {
    // If cached data is available, return it
    return res.status(200).json(cachedData);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection("CombinedData");

    let documents;
    if (searchTerm) {
      // Perform a text search on the Title field
      const searchQuery = { $text: { $search: searchTerm } };
      documents = await collection
        .find(searchQuery, { projection: { score: { $meta: "textScore" } } })
        .sort({ score: { $meta: "textScore" } })
        .toArray();
    } else if (web_id) {
      // Fetch a single document by web_id
      const id = parseInt(web_id); // Convert to Number if your IDs are numbers
      documents = await collection.findOne({ web_id: id });
      if (!documents) {
        return res.status(404).json({ error: "Document not found" });
      }
    } else if (all === "true") {
      // Fetch only the web_id of all documents if all query parameter is 'true'
      documents = await collection
        .find({}, { projection: { web_id: 1 } })
        .toArray();
    } else {
      // Get a random sample of 20 documents if no web_id, all, or searchTerm is provided
      documents = await collection
        .aggregate([{ $sample: { size: 20 } }])
        .toArray();
    }

    cache.put(cacheKey, documents, 30 * 1000); // Cache the data for 30 seconds

    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to fetch documents", details: error.message });
  } finally {
    await client.close();
  }
}

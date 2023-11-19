// utils/mongodbUtil.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "GPT-Combined";

let client;
let clientPromise;

// Create a single MongoClient instance that will be reused across requests
// This approach assumes you are using MongoDB 3.6 or later
if (!client) {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  clientPromise = client.connect();
}

async function connectToDatabase() {
  // Wait for the client connection promise to resolve
  await clientPromise;
  return client.db(dbName);
}

export async function findDocumentByWebId(web_id) {
  const db = await connectToDatabase();
  const collection = db.collection("CombinedData");
  const document = await collection.findOne({ web_id: parseInt(web_id) });
  return document;
}

export async function findAllDocuments() {
  const db = await connectToDatabase();
  const collection = db.collection("CombinedData");
  const documents = await collection.find({}).toArray();
  return documents;
}

export async function findDocumentsWithTextSearch(searchTerm) {
  const db = await connectToDatabase();
  const collection = db.collection("CombinedData");
  const documents = await collection
    .find(
      { $text: { $search: searchTerm } },
      { projection: { score: { $meta: "textScore" } } }
    )
    .sort({ score: { $meta: "textScore" } })
    .toArray();
  return documents;
}
export async function findDocumentsByCategory(category) {
  const db = await connectToDatabase();
  const collection = db.collection("CombinedData");
  const documents = await collection.find({ Category: category }).toArray();
  return documents;
}

export async function findAllCategories() {
  const db = await connectToDatabase();
  const collection = db.collection("CombinedData");
  const categories = await collection.distinct("Category"); // Assumes 'Category' is a field in your documents
  return categories;
}

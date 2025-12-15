// backend/get-test-runs/index.js
const {
  DynamoDBClient,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

// 👇 add this once and reuse it
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
};

exports.handler = async (event) => {
  try {
    const tableName = process.env.TEST_RUNS_TABLE_NAME;

    const statusFilter = event.queryStringParameters?.status;
    const envFilter = event.queryStringParameters?.environment;
    const triggeredByFilter = event.queryStringParameters?.triggered_by;

    const result = await client.send(
      new ScanCommand({ TableName: tableName })
    );

    let items = (result.Items || []).map((item) => unmarshall(item));

    // filters (same as before)
    if (statusFilter) {
      items = items.filter(
        (i) => i.status?.toUpperCase() === statusFilter.toUpperCase()
      );
    }

    if (envFilter) {
      items = items.filter(
        (i) => i.environment?.toUpperCase() === envFilter.toUpperCase()
      );
    }

    if (triggeredByFilter) {
      items = items.filter(
        (i) =>
          i.triggered_by?.toLowerCase() === triggeredByFilter.toLowerCase()
      );
    }

    // 👉 sort by created_at (newest first)
    items.sort((a, b) => {
      if (!a.created_at) return 1;
      if (!b.created_at) return -1;
      return b.created_at.localeCompare(a.created_at);
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,          // 👈 add CORS on success
      body: JSON.stringify(items),
    };
  } catch (err) {
    console.error("Error fetching test runs", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,          // 👈 and on error
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

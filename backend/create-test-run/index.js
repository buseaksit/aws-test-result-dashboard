// backend/create-test-run/index.js

const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
};

exports.handler = async (event) => {
  console.log('Incoming event:', JSON.stringify(event));

  const tableName = process.env.TEST_RUNS_TABLE_NAME;
  if (!tableName) {
    console.error('TEST_RUNS_TABLE_NAME is not set');
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Server misconfigured' }),
    };
  }

  // ---- Parse JSON body safely ----
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    console.error('Invalid JSON body', err);
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Invalid JSON body' }),
    };
  }

  const {
    suite_name,
    environment,
    status,
    total_tests,
    passed,
    failed,
    triggered_by,
  } = body;

  // Basic validation
  if (!suite_name || !status) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'suite_name and status are required',
      }),
    };
  }

  const now = new Date().toISOString();
  const testRunId = `${Date.now()}-${suite_name}`.replace(/\s+/g, '-');

  const item = {
    test_run_id: { S: testRunId },
    suite_name: { S: suite_name },
    environment: { S: environment || 'unknown' },
    status: { S: status },
    total_tests: { N: String(total_tests ?? 0) },
    passed: { N: String(passed ?? 0) },
    failed: { N: String(failed ?? 0) },
    triggered_by: { S: triggered_by || 'unknown' },
    created_at: { S: now },              // ✅ FIXED: proper AttributeValue
  };

  const command = new PutItemCommand({
    TableName: tableName,
    Item: item,
  });

  try {
    await client.send(command);
    console.log('Item stored successfully');
    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'Test run created',
        test_run_id: testRunId,
      }),
    };
  } catch (err) {
    console.error('Error writing to DynamoDB:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Failed to store test run' }),
    };
  }
};

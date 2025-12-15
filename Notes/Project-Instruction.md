# AWS Test Result Dashboard — Full Project Instructions (Notes)

This document explains **every step** of building your AWS Test Result Dashboard project — from folder structure, CDK setup, Lambda creation, DynamoDB table, API Gateway, and validation.

Use this as your personal reference inside VS Code.

---

## 🔷 PHASE 1 — Create Project Structure (Local Only)

### 1. Create main project folder

```
mkdir aws-test-result-dashboard
cd aws-test-result-dashboard
```

### 2. Create subfolders

```
mkdir backend frontend infra tests
```

### 3. Create README.md

```
touch README.md
```

Add a simple description of your project.

### 4. Initialize Git (LOCAL ONLY)

```
git init
git add .
git commit -m "Initial project setup"
```

Nothing is pushed to GitHub yet.

---

## 🔷 PHASE 2 — Set Up AWS CDK Project

### 1. Navigate into the infra folder

```
cd infra
```

### 2. Initialize AWS CDK TypeScript app

```
npx aws-cdk init app --language typescript
```

This creates folders:

```
bin/
lib/
package.json
tsconfig.json
```

### 3. Fix npm cache/permission issues on macOS (if needed)

```
npm cache clean --force
sudo chown -R $(whoami) ~/.npm
```

### 4. Install TypeScript + Dependencies

```
npm install --save-dev typescript ts-node
npm install aws-cdk-lib constructs
```

### 5. Build once

```
npm run build
```

Should compile successfully.

---

## 🔷 PHASE 3 — Create DynamoDB Table With CDK

Open file:

```
infra/lib/infra-stack.ts
```

Replace constructor content with:

```ts
// DynamoDB table for test runs
const testRunsTable = new Table(this, 'TestRunsTable', {
  partitionKey: { name: 'test_run_id', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
  tableName: 'TestRuns',
});
```

This table will store:

* test_run_id
* suite_name
* environment
* status
* total_tests
* passed
* failed
* triggered_by
* timestamps

---

## 🔷 PHASE 4 — Create Lambda Function

### 1. Create Lambda folder

```
cd backend
mkdir create-test-run
cd create-test-run
```

### 2. Create index.js

```
nano index.js
```

Paste Lambda code that:

* reads request body
* validates required fields
* generates test_run_id
* writes item to DynamoDB using AWS SDK v3
* returns success JSON

### 3. Initialize lambda dependencies

```
npm init -y
npm install @aws-sdk/client-dynamodb
```

---

## 🔷 PHASE 5 — Connect Lambda to CDK + API Gateway

Update `infra-stack.ts` imports:

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
```

Inside constructor, after DynamoDB table:

```ts
// Lambda function to handle POST /test-runs
const createTestRunFn = new lambda.Function(this, 'CreateTestRunFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset('../backend/create-test-run'),
  environment: {
    TEST_RUNS_TABLE_NAME: testRunsTable.tableName,
  },
});

// Allow Lambda to write to DynamoDB
testRunsTable.grantWriteData(createTestRunFn);

// API Gateway REST API
const api = new apigw.RestApi(this, 'TestResultsApi', {
  restApiName: 'Test Results Service',
  deployOptions: { stageName: 'dev' },
});

// POST /test-runs
const testRunsResource = api.root.addResource('test-runs');
testRunsResource.addMethod('POST', new apigw.LambdaIntegration(createTestRunFn));
```

### Build again

```
npm run build
```

If successful → backend infrastructure is ready.

---

## 🔷 PHASE 6 — (Optional) Deploy to AWS

### Configure AWS credentials locally

```
aws configure
```

Add:

* Access Key
* Secret Key
* Region

### Deploy CDK stack

```
cdk synth
cdk deploy
```

This creates:

* DynamoDB table
* Lambda function
* API Gateway endpoint

You will get a URL:

```
https://xxxx.execute-api.aws-region.amazonaws.com/dev/test-runs
```

---

## 🔷 PHASE 7 — Test the API

### Use Postman or curl:

```
POST /test-runs
Content-Type: application/json
{
  "suite_name": "Login Tests",
  "environment": "QA",
  "status": "PASSED",
  "total_tests": 12,
  "passed": 12,
  "failed": 0,
  "triggered_by": "Local"
}
```

You should receive:

```
201 Created
{"message":"Test run created","test_run_id":"12345"}
```

Check DynamoDB table in AWS Console.

---

## 🔷 PHASE 8 — Playwright Integration (Future Step)

After your Playwright runs, send results with:

```ts
await fetch("https://API-ID.execute-api.region.amazonaws.com/dev/test-runs", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(resultsObject)
});
```

---

## 🔷 PHASE 9 — Build Frontend Dashboard (Later)

You will create:

* frontend/ folder
* React or HTML dashboard
* Fetch data from GET /test-runs (next phase)
* Host on S3

---

## ✅ Final Status So Far

You have built:

* [x] Project folder structure
* [x] CDK infrastructure project
* [x] DynamoDB TestRuns table
* [x] Lambda function to create test results
* [x] API Gateway with `/test-runs` POST
* [x] Infrastructure compiles with `npm run build`
* [x] Everything stays local until you deploy

You are now ready for:
➡️ **Deployment**
➡️ **Testing the API**
➡️ **Adding GET endpoint**
➡️ **Building the frontend dashboard**

---


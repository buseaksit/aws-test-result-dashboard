🚀 AWS Test Result Dashboard

A full-stack, serverless Test Result Dashboard built with AWS Lambda, API Gateway, DynamoDB, CDK, and a React (Vite) frontend.
Designed to store and visualize automated test results from Postman, Playwright, CI pipelines, or any test framework.

This project demonstrates strong SDET/QA engineering skills including backend API design, AWS architecture, full-stack frontend development, UI dashboards, and data visualization.

⭐ Features
🔹 Full Test Results Dashboard

Displays all executed test runs

Shows status (Passed/Failed/Running)

Environment badges (QA / STG / PROD)

Total tests, passed, failed

Timestamp and quick summaries

Clean dark-themed UI

🔹 Detailed Test Run Page

Expanded view for each test run:

Summary cards (total, passed, failed, status)

Status & environment badges

Pass/Fail pie chart

Run metadata (suite name, triggered_by, start time, ID)

Matching dark UI theme

🔹 Fully Serverless Backend

AWS Lambda (Node.js 18)

API Gateway REST API

DynamoDB table (TestRuns)

CORS enabled

AWS CDK (TypeScript) for infrastructure

🔹 Frontend

React + Vite

React Router (multi-page)

Recharts (charts)

API client with environment variables (VITE_API_URL)

🏗 Architecture Overview
Frontend (React + Vite)
        │
        │ fetches data / posts test runs
        ▼
API Gateway (REST)
  GET /test-runs
  POST /test-runs
        │
        ▼
Lambda Functions
  create-test-run (PUT)
  get-test-runs (SCAN)
        │
        ▼
DynamoDB (TestRuns Table)

📂 Project Structure
aws-test-result-dashboard/
│
├── infra/                      # AWS CDK project
│   ├── bin/infra.ts
│   ├── lib/infra-stack.ts
│   └── cdk.out/
│
├── backend/
│   ├── create-test-run/
│   │   └── index.js
│   └── get-test-runs/
│       └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── TestRunDetailPage.jsx
│   │   ├── api/apiClient.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.css
│   └── vite.config.js
│
└── README.md

⚙️ Backend Endpoints
POST /test-runs

Creates a new test run entry.

Example Request:

{
  "suite_name": "Smoke Tests",
  "status": "PASSED",
  "total_tests": 12,
  "passed": 12,
  "failed": 0,
  "environment": "QA",
  "triggered_by": "Postman"
}

GET /test-runs

Returns all test runs stored in DynamoDB.

🧪 Seeding Data (Postman Example)
POST https://<api-id>.execute-api.us-east-1.amazonaws.com/dev/test-runs


Body:

{
  "suite_name": "Sample Test Suite",
  "status": "PASSED",
  "environment": "QA",
  "total_tests": 10,
  "passed": 10,
  "failed": 0,
  "triggered_by": "Postman"
}

🖥 Running the Frontend Locally
1️⃣ Set your API URL

Create/edit:

frontend/.env


Add:

VITE_API_URL=https://<your-api-id>.execute-api.us-east-1.amazonaws.com/dev

2️⃣ Start the frontend
cd frontend
npm install
npm run dev


Open:

http://localhost:5173

🛠 Deploying AWS Infrastructure
cd infra
npm install
cdk bootstrap
cdk deploy


Copy the output API URL into your frontend .env.

🧠 Skills Demonstrated
Backend Engineering

Designing REST APIs

AWS Lambda (Node.js 18)

DynamoDB schema design

Infrastructure as Code (CDK)

CORS, input validation, error handling

Frontend Engineering

React dashboards

Multi-page routing (React Router)

Recharts for visualization

Dark theme UI layouts

Environment-based configs

Testing & DevOps

Test run ingestion API

Postman validation

Can integrate with Playwright test suites for automatic reporting

Serverless deployment via CDK

🎯 Future Enhancements (Optional)

Filter runs by status or environment

Add CI integration

Trigger real test runs from UI

Deploy frontend to S3 + CloudFront

Add historical line charts

🙌 Author

Buse Akşit
QA Engineer / SDET
📍 New Jersey, USA
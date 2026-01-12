AWS Test Result Dashboard

A serverless platform designed to collect, store, and visualize automated test results in real time.
This project demonstrates how modern QA automation, cloud services, and frontend dashboards can work together in a scalable architecture.

🎯 Goal

Build a serverless system that:

Accepts automated test results via API

Stores them in a cloud database

Displays them on a web dashboard

Is scalable, cost-efficient, and CI/CD-friendly

🧠 Why This Project?

This project was created to showcase:

SDET-focused architecture

Real-world automation integration

Serverless AWS patterns

Clean, maintainable structure

Production-style workflows

It is designed to reflect how test reporting systems work in real enterprise environments.

🏗️ Architecture Overview

Flow:

Automation Tests
→ API Gateway
→ AWS Lambda
→ DynamoDB
→ Frontend Dashboard (S3 / CloudFront)

☁️ AWS Services Used

API Gateway – Public endpoints for submitting and retrieving test results

AWS Lambda – Backend logic (create, read, process test data)

DynamoDB – NoSQL storage for test runs

S3 – Static frontend hosting

CloudFront (optional) – CDN for faster delivery

🧩 Project Structure
aws-test-result-dashboard/
│
├── backend/        # Lambda handlers & API logic
├── frontend/       # React/Vite dashboard UI
├── infra/          # AWS CDK infrastructure
├── tests/          # API & integration tests
├── Notes/          # Planning and design notes
└── README.md

⚙️ How It Works

Automated tests send results to the API

API Gateway triggers Lambda

Lambda validates and stores the data in DynamoDB

Frontend fetches the data

Dashboard displays real-time results

🛠️ Tech Stack

Backend

Node.js

AWS Lambda

API Gateway

DynamoDB

Frontend

React

Vite

TypeScript

Infrastructure

AWS CDK (TypeScript)

Testing

Playwright (API + UI)

REST-based validation

🚀 Local Setup
git clone https://github.com/buseaksit/aws-test-result-dashboard.git
cd aws-test-result-dashboard

Backend
cd backend
npm install

Frontend
cd frontend
npm install
npm run dev

📦 Deployment (Planned Flow)

This project is structured for CI/CD-style deployment:

CDK deploys infrastructure

Lambdas are built & uploaded

Frontend is built

Frontend is pushed to S3

CloudFront serves UI

🗺️ Roadmap

 Add authentication

 Add filtering by test suite

 Add historical trends

 Add CI integration (GitHub Actions)

 Add Allure / Playwright ingestion

 Add charts and analytics

👤 Author

Buse Aksit
UI Automation Engineer | SDET

🔗 GitHub: https://github.com/buseaksit

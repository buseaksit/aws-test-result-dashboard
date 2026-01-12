# AWS Test Result Dashboard

A serverless platform designed to collect, store, and visualize automated test results in real time.  

## 🎯 Goal

Build a serverless system that:

- Accepts automated test results via API
- Stores them in a cloud database
- Displays them on a web dashboard
- Is scalable, cost-efficient, and CI/CD-friendly

---

## 🧠 Why This Project?

This project was created to showcase:

- SDET-focused architecture
- Real-world automation integration
- Serverless AWS patterns
- Clean, maintainable structure
- Production-style workflows

It is designed to reflect how test reporting systems work in real enterprise environments.

---

## 🏗️ Architecture Overview

**Flow:**
Automation Tests → API Gateway → AWS Lambda → DynamoDB → Frontend Dashboard (S3 / CloudFront)

---

## ☁️ AWS Services Used

- **API Gateway** – Public endpoints for submitting and retrieving test results
- **AWS Lambda** – Backend logic (create, read, process test data)
- **DynamoDB** – NoSQL storage for test runs
- **S3** – Static frontend hosting
- **CloudFront (optional)** – CDN for faster delivery

---

## 🧩 Project Structure
aws-test-result-dashboard/
│
├── backend/        # Lambda handlers & API logic
├── frontend/       # React/Vite dashboard UI
├── infra/          # AWS CDK infrastructure
├── tests/          # API & integration tests
├── Notes/          # Planning and design notes
└── README.md


---

## ⚙️ How It Works

1. Automated tests send results to the API
2. API Gateway triggers Lambda
3. Lambda validates and stores the data in DynamoDB
4. Frontend fetches the data
5. Dashboard displays real-time results

---

## 🛠️ Tech Stack

### Backend
- Node.js
- AWS Lambda
- API Gateway
- DynamoDB

### Frontend
- React
- Vite
- TypeScript

### Infrastructure
- AWS CDK (TypeScript)

### Testing
- Playwright (API + UI)
- REST-based validation

---

## 🚀 Local Setup

```bash
git clone https://github.com/buseaksit/aws-test-result-dashboard.git
cd aws-test-result-dashboard
```
---

## 🎯 Goal


Build a serverless system that:

- Accepts automated test results via API
- Stores them in a cloud database
- Displays them on a web dashboard
- Is scalable, cost-efficient, and CI/CD-friendly

---

## 🧠 Why This Project?

This project was created to showcase:

- SDET-focused architecture
- Real-world automation integration
- Serverless AWS patterns
- Clean, maintainable structure
- Production-style workflows

It reflects how test reporting systems work in real enterprise environments.

---

## 🏗 Architecture Overview

**Flow:**

```text
Automation Tests → API Gateway → AWS Lambda → DynamoDB → Frontend Dashboard (S3 / CloudFront)
```

---

## ☁️ AWS Services Used

- **API Gateway** – Public endpoints for submitting and retrieving test results
- **AWS Lambda** – Backend logic (create, read, process test data)
- **DynamoDB** – NoSQL storage for test runs
- **S3** – Static frontend hosting
- **CloudFront (optional)** – CDN for faster delivery

---
## 📁 Project Structure

```text
aws-test-result-dashboard/
│
├── backend/        # Lambda handlers & API logic
├── frontend/       # React/Vite dashboard UI
├── infra/          # AWS CDK infrastructure
├── tests/          # API & integration tests
├── Notes/          # Planning and design notes
│
├── .gitignore
└── README.md
```

---

## ⚙️ How It Works

1. Automated tests send results to the API
2. API Gateway triggers Lambda
3. Lambda validates and stores data in DynamoDB
4. Frontend fetches the results
5. Dashboard displays them visually

---

## 🚀 Local Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/buseaksit/aws-test-result-dashboard.git
cd aws-test-result-dashboard 
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ Infrastructure (CDK)
```bash
cd infra
npm install
cdk deploy
```

## 🔌 API Example

### Submit test result

**Endpoint:**
`POST /test-runs`

**Request Body (JSON):**
```json
{
  "suiteName": "Login Tests",
  "status": "PASSED",
  "total": 10,
  "passed": 10,
  "failed": 0,
  "environment": "staging"
}
```
## 🧪 Designed for CI/CD

This project is built with CI/CD in mind:

- Can be triggered by automation pipelines
- API-based ingestion
- Serverless scaling
- Real-time visibility into test health
- Cloud-native architecture

---

## 🔮 Future Improvements

- Authentication (Cognito)
- Historical charts
- Filtering & search
- Environment comparison
- Slack / email notifications
- Playwright / Cypress auto-ingestion
- Role-based dashboards

---

## 👩‍💻 Author

**Buse Aksit**  
- Software Development Engineer in Test
- GitHub: https://github.com/buseaksit

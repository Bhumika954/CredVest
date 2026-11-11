CredVest — Intelligent Banking, Investment & Financial Planning Platform
CredVest is a full-stack financial web application that brings personal banking views, investment analysis, expense insights, and goal-based financial planning into one interface. It combines a React frontend, a Node.js/Express backend, MongoDB persistence, and a Python-based machine-learning service for stock forecasting.
Project/demo note: Screenshots illustrate the application's current interface and sample data. Market values, forecasts, AI-generated summaries, and financial suggestions should be treated as demonstration outputs—not guaranteed live prices, investment advice, or guaranteed returns.

Contents
- Overview
- Features
- Screenshots
- Technology Stack
- Architecture
- Application Workflow
- API Overview
- Database Design
- Machine-Learning Module
- Security
- Getting Started
- Configuration
- Future Improvements
Overview
CredVest is designed to make common financial tasks easier to understand and manage from a centralized dashboard. Users can review account and transaction information, explore stock-market data, inspect historical price charts, generate forecasts, analyze uploaded bills, and create financial goals.
Features
Banking dashboard
- Summary cards for account balance, income, and expenses.
- Account details and recent transaction history.
- Quick actions for common banking-related workflows.
Investment analysis
- Search and select supported stock symbols.
- Stock overview, historical data, and interactive candlestick charts.
- Watchlist functionality.
- Technical and historical indicators such as CAGR, annualized volatility, maximum drawdown, momentum, and moving-average distances.
- Forecast visualizations and rule-based insight summaries.
OCR bill analyzer
- Upload a bill or receipt image for text extraction.
- Review parsed line items and amounts.
- Categorize expenses and inspect category distribution.
- Compare monthly expense summaries.
- Export analysis reports where supported by the interface.
Goal-based financial planner
- Create a goal by entering a target amount and timeline.
- View projected value, estimated monthly contribution, and allocation breakdown.
- Review generated insights and suggested investment categories.
- Access supporting actions such as optimization, backtesting, alerts, and a goal moodboard where available.
AI support assistant
- Chat-style assistant for questions about the CredVest interface and general banking or investment topics.
- Suggested prompts to help users get started.
Screenshots
The screenshots below are grouped by the feature they demonstrate.
1. Dashboard and banking
Main dashboard
<img width="1427" height="713" alt="image" src="https://github.com/user-attachments/assets/f53bf3c4-ddf1-4f9e-8de3-71951aa6dbfc" />

Bank account details
<img width="1744" height="633" alt="image" src="https://github.com/user-attachments/assets/b4152dac-488c-4d38-aad4-30ed0fe80cf4" />

2. Investment analysis
Market overview and symbol selection
<img width="1523" height="619" alt="image" src="https://github.com/user-attachments/assets/5ddb4513-8995-46c2-82fe-a2080d37e14d" />

Interactive stock chart
<img width="1543" height="726" alt="image" src="https://github.com/user-attachments/assets/46502cc4-337d-49cc-8cc0-46f99979f687" />

Historical price and forecast comparison
<img width="1534" height="714" alt="image" src="https://github.com/user-attachments/assets/3f4ae936-b512-49c7-8637-d42729a957df" />

Performance metrics and generated insights
<img width="1514" height="723" alt="image" src="https://github.com/user-attachments/assets/26ec13ee-bc6a-427b-9595-60faa1b2afa6" />

3. OCR bill analyzer
Upload a bill for extraction and analysis
<img width="1528" height="714" alt="image" src="https://github.com/user-attachments/assets/00351581-cedd-48a8-8dae-d3b21d202d47" />

Parsed items, category distribution, and expense comparison
<img width="1500" height="716" alt="image" src="https://github.com/user-attachments/assets/2c516f13-fd14-4e45-a5a0-96b8d768cda0" />

4. Goal-based financial planning
Create a financial goal
<img width="1564" height="735" alt="image" src="https://github.com/user-attachments/assets/5499721e-0738-44c7-8cb9-e32b7e77a64d" />

Goal allocation and AI-generated insights
<img width="1620" height="704" alt="image" src="https://github.com/user-attachments/assets/62c4b7e6-c4cd-4d45-803d-a5d99186020c" />

Suggested stocks and mutual funds
<img width="1552" height="723" alt="image" src="https://github.com/user-attachments/assets/f75ccf44-6111-440c-813c-d6458e146a1b" />

5. AI support
CredVest AI assistant interface
<img width="1550" height="724" alt="image" src="https://github.com/user-attachments/assets/053538fb-3c90-4cd6-9122-0bc6d0d36d84" />


Technology Stack

Layer	Technologies
Frontend	React.js, Vite, Bootstrap / React-Bootstrap, Chart.js
Backend	Node.js, Express.js, REST APIs
Database	MongoDB, Mongoose
Machine learning / data processing	Python, Pandas, NumPy, Scikit-learn
Authentication	JSON Web Tokens (JWT), password hashing
Visualization	Chart.js and interactive chart components


Use the exact package versions and additional libraries recorded in the project's dependency files.
Architecture
CredVest uses a client–server architecture with a separate Python service for prediction tasks.
<img width="447" height="390" alt="image" src="https://github.com/user-attachments/assets/faca53b2-07e9-46da-8e1d-9dbee4c38b35" />

- Frontend: renders dashboards, forms, charts, and user interactions.
- Backend: exposes REST endpoints and handles application logic.
- Database: stores user, portfolio, and transaction-related records.
- AI advisor service: processes historical stock data and returns forecast-related outputs.
Application Workflow
1. A user registers or signs in.
2. The frontend communicates with the backend through REST APIs.
3. The backend validates requests and reads or updates the relevant MongoDB records.
4. Portfolio and transaction information is returned to the dashboard.
5. For prediction requests, the backend communicates with the Python AI advisor service.
6. The prediction response is displayed through charts and insight panels.
7. For bill analysis, the uploaded image is processed and extracted items are presented for review and categorization.
8. For financial goals, the planner uses the supplied target and timeline to display projections and allocation suggestions.
API Overview
The following route groups describe the API organization at a high level. Refer to the backend source code for the exact endpoint paths, HTTP methods, request bodies, and response formats.
Route group	Responsibility
/api/auth	User registration and authentication
/api/portfolio	Portfolio information and management
/api/transactions	Buy/sell operations and transaction history
/api/stocks	Stock data retrieval
/api/predict	Stock prediction requests


Additional routes may be present for banking, OCR, goals, and AI support depending on the current backend implementation.
Database Design
The core MongoDB collections described for the application are:
Collection	Purpose
Users	User account and authentication-related information
Portfolios	User portfolio information and holdings
Transactions	Buy, sell, and other transaction records
Stocks	Stock-related records or cached market information


Transactions should reference the relevant user and portfolio so that records can be associated with the correct account. Check the Mongoose schemas for the definitive field names and relationships.
Machine-Learning Module
The Python service is responsible for prediction-related processing.

Typical processing flow:
1. Obtain historical stock-price data.
2. Prepare and clean the data using Python data-processing libraries.
3. Apply the configured forecasting or regression approach.
4. Generate forecast values for the requested horizon.
5. Return the result to the backend for display in the frontend.
The model name and forecasting method shown in the interface should be interpreted according to the implementation currently present in services/ai_advisor. Forecasts are estimates based on historical data and are not guarantees of future market performance.
Security
The project description includes the following security mechanisms:
- JWT-based authentication.
- Password hashing.
- Protected backend routes.
Review the actual middleware and authorization checks before describing the application as production-ready. Never commit secrets, API keys, database credentials, or populated .env files to the repository.
Getting Started
Prerequisites
Install the tools required by the project:
- Node.js and npm.
- MongoDB (local instance or hosted database).
- Python 3 and pip for the AI advisor service.
1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd credvest
Replace <YOUR_REPOSITORY_URL> with the actual Git repository URL.
2. Set up the backend
cd backend
npm install
Create the backend environment file using the variable names expected by the backend configuration. Configure the MongoDB connection string, JWT secret, and any external service credentials required by your implementation.

Start the backend using the script defined in backend/package.json. For example, if the project defines a dev script:
npm run dev
3. Set up the frontend
Open a second terminal:
cd frontend
npm install
Create the frontend environment file if required and set the backend API base URL using the environment variable name expected by your Vite configuration.

Start the frontend using the script defined in frontend/package.json. For example:
npm run dev
4. Set up the AI advisor service
Follow the service-specific instructions and dependency list inside services/ai_advisor. A typical Python setup may look like:
cd services/ai_advisor
python -m venv .venv
Activate the virtual environment:

Windows (PowerShell)
.venv\Scripts\Activate.ps1
macOS / Linux
source .venv/bin/activate
Install dependencies using the service's requirements file, if present:
pip install -r requirements.txt
Then start the service using the entry point and command documented in that folder.
Important: The exact scripts, environment-variable names, Python entry point, and service port depend on the repository implementation. Check the README, package.json, .env.example, and dependency files inside backend, frontend, and services/ai_advisor rather than assuming the example commands above match every setup.

Configuration
Keep local configuration in environment files that are excluded from version control. Common configuration values may include:
- MongoDB connection URI.
- JWT signing secret.
- Backend port.
- Frontend API base URL.
- Market-data or OCR provider credentials, if used.
- AI advisor service URL.
Use the variable names expected by the source code. An .env.example containing placeholder values is recommended.
Future Improvements
- Integrate and validate reliable real-time market-data providers.
- Improve forecasting with additional models and out-of-sample evaluation.
- Add confidence intervals and model-performance metrics to prediction views.
- Strengthen portfolio risk analysis and diversification reporting.
- Improve OCR accuracy across different receipt layouts and languages.
- Add automated tests, API documentation, and deployment workflows.
- Add accessibility and responsive-layout improvements.
- Add clearer disclosures and safeguards around AI-generated financial insights.
Repository layout
A suggested high-level layout is shown below; adjust it to match the actual files in your repository.
credvest/
├── backend/
├── frontend/
├── services/
│   └── ai_advisor/
├── docs/
│   └── screenshots/
└── README.md
Disclaimer
CredVest is a software project for learning and demonstration. It is not a bank, broker, registered investment adviser, or substitute for professional financial advice. Sample balances, forecasts, recommendations, and projections shown in screenshots may be illustrative or dependent on external data sources. Verify all financial information independently before making decisions.

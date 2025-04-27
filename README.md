# Delaware DSA Automation System

A modular platform to streamline chapter operations for Delaware DSA.

## Getting Started

### Prerequisites
- Node.js (via nvm)
- Docker
- Git

### Installation

1. Clone the repository
   ```
   git clone https://github.com/josuejero/delaware-dsa-automation.git
   cd delaware-dsa-automation
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

## Project Structure

```
delaware-dsa-automation/
├── src/              # Source code
│   ├── api/          # Express route handlers
│   ├── services/     # Business logic
│   ├── models/       # Data models
│   └── utils/        # Shared helpers
├── tests/            # Tests
│   ├── unit/         # Unit tests
│   └── integration/  # Integration tests
├── .github/workflows # CI pipeline
├── .gitignore        # Git ignore file
├── README.md         # Project documentation
└── package.json      # Dependencies
```




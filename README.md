# AeroBill - Premium Enterprise Billing Dashboard

A containerized, full-stack Billing Dashboard application designed for modern SaaS businesses. It incorporates a TypeScript/Express backend API, a premium Vite/React/TypeScript dashboard frontend, and a multi-stage Docker orchestration setup.

## Features

- **Stats & Quotas Overview**: Tracks monthly spending, total paid, pending payments, and active overdue balances.
- **Quota & Service Usage Progress**: Real-time visual tracking of service parameters (e.g. AWS data transfer, OpenAI token usage) with responsive bar levels.
- **Interactive Ledger Table**: Fully searchable and filterable table displaying detailed billing line-items.
- **Simulated Secure Checkout Modal**: Visual credit card simulator to verify and execute payments, automatically transitioning invoice status to Paid.
- **Dynamic Invoice Draft Creator**: Multi-item line invoice builder calculating overall amounts dynamically in real-time.
- **Projected SVG Trend Charts**: Interactive SVG line charts visualizing monthly spend curves.
- **Dark Mode Support**: One-click premium dark/light toggling.
- **Robust Client Fallback**: Offline mode works with mock client states even when database or API is unreachable.

## Architecture

- **Backend**: Node.js, Express, TypeScript (listening on port `5000`)
- **Frontend**: React, TypeScript, Vite, Custom Vanilla CSS (listening on port `3000`)
- **Orchestration**: Multi-stage Docker files served via an Nginx reverse proxy

## How to Build and Run

Ensure you have [Docker](https://www.docker.com/) and Docker Compose installed.

### Option 1: Docker Compose (Recommended)

To start the full stack, run:
```bash
docker compose up --build
```
Once initialized, visit the dashboard at **[http://localhost:3000](http://localhost:3000)**. The API server is exposed on **[http://localhost:5000](http://localhost:5000)**.

### Option 2: Local Development (Without Containers)

#### 1. Start Backend API
```bash
cd backend
npm install
npm run dev
```

#### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

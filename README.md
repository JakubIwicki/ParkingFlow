# ParkingFlow

A modern parking management system built with ASP.NET Core, React and TypeScript, providing comprehensive parking area management and payment processing capabilities.

## Project Overview

ParkingFlow is a full-stack web application for managing parking areas, calculating parking fees, and processing payments. The system enables users to create and manage parking areas, calculate parking costs based on time duration and area-specific rates, and maintain parking fee records.

## Key Features

### Core Functionalities

- **Dashboard Analytics**: Overview of parking management with key metrics and statistics
- **Parking Area Management**: Create, edit, view, and delete parking areas with custom pricing
- **Payment Calculation**: Real-time calculation of parking fees based on time and area rates
- **Parking Fee Tracking**: Complete history of parking transactions and payments
- **User Authentication**: Secure login and registration system
- **Multi-Currency Support**: Pricing in USD, EUR, and PLN currencies

## Technologies

### Backend Technology Stack
- **ASP.NET Core [.NET 9.0]**: Server-side framework for building APIs and services
- **RavenDB ORM**: ORM for database interactions
- **JWT Tokens**: JSON Web Token authentication mechanism

### Frontend Framework
- **React**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Fast development build tool with Hot Module Replacement

### UI/UX Framework
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn/ui**: Modern component library built on Radix UI
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful and consistent icons

### Charts & Visualization
- **Recharts**: Composable charting library for React
- **Date-fns**: Modern date utility library

## Main Application Routes

- **`/`** - Dashboard with analytics and overview
- **`/login`** - User authentication
- **`/pay`** - Payment processing and calculation
- **`/parkingareas`** - Parking area management
- **`/parkingareas/new`** - Create new parking area
- **`/parkingareas/:id`** - Edit existing parking area
- **`/parkingfees`** - Parking fee history and records

### Payment Calculation
The system calculates parking fees based on:
- Start and end time
- Parking date (weekday vs weekend rates)
- Area-specific hourly rates
- Applied discount percentages
- Multi-currency conversion

ExchangeApi reference [http://api.exchangeratesapi.io/v1/]

### Data Flow
1. User selects parking area and time period
2. System calculates cost using area-specific rates
3. Payment is processed and recorded
4. Transaction history is maintained
5. Dashboard analytics are updated

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- .NET development certificates (for HTTPS)

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd parkingflow.client

# Install dependencies
npm install

# Start development server
npm run dev
```
Backend works on: https://localhost:5020
Frontend works on: https://localhost:52759

## API Integration

The application communicates with a backend API (assumed to be ASP.NET Core) through:
- RESTful API endpoints
- JWT token authentication
- HTTPS secure communication
- Proxy configuration for development

## Dashboard Features

The dashboard provides:
- Total parking areas count
- Active parking areas statistics
- Total parking fees processed
- Monthly revenue tracking (current and previous month)
- Visual charts for revenue trends
- Key performance indicators

## Authentication & Security

- JWT token-based authentication
- Protected routes with authentication guards
- Secure API communication over HTTPS
- User session management
- Automatic token refresh handling

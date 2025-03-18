# React TypeScript Frontend Application

This is a responsive React TypeScript application with authentication, multilingual support, and containerization.

## Features

- **Responsive Design**: Mobile, tablet, and desktop support
- **Authentication**: JWT-based authentication
- **Multilingual Support**: English and Hebrew with RTL/LTR handling
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form with Yup validation
- **API Integration**: Axios with JWT tokens
- **Containerization**: Docker & Docker Compose

## Technology Stack

- React with TypeScript
- Next.js
- TailwindCSS
- Redux Toolkit
- React Hook Form + Yup
- i18next for internationalization
- Axios for API requests
- Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker and Docker Compose (for containerized setup)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create environment variables:
   ```
   cp .env.example .env
   ```
   Update the values in the `.env` file with your own configuration.

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

### Docker Setup

1. Build the Docker image:
   ```
   docker-compose build
   ```

2. Run the container:
   ```
   docker-compose up
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `/src`
  - `/app`: Next.js app directory
  - `/components`: Reusable UI components
  - `/store`: Redux store setup
    - `/slices`: Redux slices
  - `/hooks`: Custom React hooks
  - `/services`: API services
  - `/i18n`: Internationalization setup
    - `/locales`: Translation files
  - `/styles`: Global styles

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests. Protected routes redirect unauthenticated users to the login page.

## Multilingual Support

The application supports both English (LTR) and Hebrew (RTL) languages. Users can switch between languages using the language switcher component.

## Deployment

For production deployment, use the included Docker configuration:

```
docker-compose -f docker-compose.yml up -d
```

## License

[MIT License](LICENSE) 
# Portfolio Backend Service

Welcome to the backend service repository for my personal portfolio. This Node.js application is the behind-the-scenes engine that powers the dynamic functions of my portfolio, providing a robust API for the frontend to consume. It's designed to seamlessly run on Google App Engine, store images in Google Cloud Storage, and uses MongoDB as its database for persisting data.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete capabilities for portfolio data.
- **Secure Authentication**: Utilizes JSON Web Tokens (JWT) for secure authentication of CRUD operations.
- **Google Cloud Integration**: Hosted on Google App Engine with images stored in Google Cloud Buckets.
- **MongoDB Database**: Leverages the flexibility and scalability of MongoDB for data management.

## Getting Started

Here's how you can get this backend up and running for development or deployment purposes.

### Prerequisites

- Node.js installed on your local development machine.
- A Google Cloud Account with App Engine and Cloud Storage enabled.
- A MongoDB database, either hosted on MongoDB Atlas or your own setup.
- An understanding of Node.js and Express framework.

### Installation

Clone this repository to your local machine:

```bash
git clone https://github.com/Damione1/portfolio-nodejs.git
cd portfolio-nodejs
```

Install the necessary project dependencies:

```bash
npm install
```

### Local Development

For local development with live reloading:

```bash
npm run dev
```

This will start the server using nodemon, which will automatically reload if you make edits to server files.

### Production Start

To start the server in production:

```bash
npm run start
```
This will launch the Node.js server using the standard `node` command.

### Google App Engine Deployment

To deploy your application to Google App Engine, make sure your `app.yaml` is properly configured. Then you can run:

```bash
gcloud app deploy
```
Ensure you've initialized the Google Cloud SDK and are logged in with permissions to deploy to your chosen project.

### Environment Variables

Be sure to set up the environment variables (`.env`) in your deployment based on the sample file.

### JWT Authentication

This server uses JWT for securing endpoints related to CRUD operations. JWT tokens must be obtained via a login or a similar authentication process and included in the `Authorization` header of requests to access protected routes.

## Usage

The API endpoints exposed by this backend allow for the full suite of CRUD operations on portfolio items, authentication, and image management. The integration with Google Cloud ensures reliable and scalable storage options, particularly for image assets.

## Security Note

When deploying this backend service, make sure that all sensitive details such as database URI, JWT secrets, and Google Cloud Service credentials are secured and not exposed in your source code repository.

## Conclusion

This backend provides a solid and secure foundation for handling the data-driven operations of my portfolio. It's designed with modern tools and services in mind, offering a reliable way to manage and present my professional work. Whether you're running it locally or deploying to Google App Engine, this Node.js server is ready to support a seamless content management experience.

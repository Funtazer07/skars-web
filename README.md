# Skars Web

A professional photography portfolio and booking website built with Node.js and Express.

## Features

- Portfolio showcase with different categories (Concerts, Events, Portraits, Nightlife)
- Image upload and management using Cloudinary
- Contact form with email notifications
- Responsive design
- Server-side rendering
- Session management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MongoDB (via Mongoose)
- **File Storage**: Cloudinary
- **Email Services**: Nodemailer
- **Environment Variables**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB database
- Cloudinary account
- SendGrid account (for email functionality)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd skars-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_email_address
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
skars-web/
├── config/             # Configuration files
├── public/            # Static files (HTML, CSS, client-side JS)
├── routes/            # API route handlers
├── uploads/           # Temporary storage for uploaded files
├── server.js          # Main application file
├── package.json       # Project dependencies and scripts
└── .env              # Environment variables
```

## API Endpoints

- `GET /` - Home page
- `GET /concerts` - Concerts portfolio page
- `GET /events` - Events portfolio page
- `GET /portraits` - Portraits portfolio page
- `GET /nightlife` - Nightlife portfolio page
- `POST /api/upload` - Image upload endpoint
- `POST /api/contact` - Contact form submission
- `GET /api/photos` - Retrieve portfolio photos

## Deployment

The project is configured for deployment on Render.com using the provided `render.yaml` configuration file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

For any inquiries, please use the contact form on the website or reach out through the provided contact information. 
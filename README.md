<h1 align="center">Health Track</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff">
  <img src="https://github.com/PRASUN-SITAULA/carbonWise/assets/89672957/106f3a07-d14a-4ee9-9e0c-c8cfbc635a79">
</p>

## Description
ChitChat is a modern, user-friendly instant messaging application that enables seamless communication between users.
ChitChat provides a reliable and engaging platform for real-time communication with friends and family.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation Guide](#installation-guide)
- [License](#license)

## Features

**Real-time message delivery**: The application provides real-time message delivery, ensuring that messages are delivered instantly to the recipient.
**One-on-one conversations**: Users can have one-on-one conversations with their friends and family, allowing for personalized communication.
**Secure user authentication**: The application uses secure user authentication, ensuring that only authorized users can access the platform.
**Search functionality**: Users can search for other users by name or username, making it easy to find the right person for communication.
## Technologies

This project is built using the following technologies:

- Next.js: Frontend framework for building user interfaces.
- Supabase: Database for storing user data.
- Shadcn UI: UI library for styling.
- Clerk: Authentication library for user authentication.
- Pusher: Real-time messaging library for delivering messages.

## Installation Guide

### Clone this repository
```bash
https://github.com/PRASUN-SITAULA/chitChat.git
```
### Go into the repository
```bash
cd chitChat
```
### Install packages
```bash
npm install
```
### Configuration
#### Database Setup
- Create a .env file and add the following:
```bash
DATABASE_URL=[INSERT SUPABASE Database URL]
DIRECT_URL=[INSERT SUPABASE Database DIRECT URL]
```

#### Clerk Setup
- Create a .env.local file and add the following:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[INSERT CLERK PUBLISHABLE KEY]
CLERK_SECRET_KEY=[INSERT CLERK SECRET KEY]

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/setup
```

#### Pusher Setup
- In the .env.local file, add the following:
```bash
PUSHER_APP_ID=[INSERT PUSHER APP ID]
NEXT_PUBLIC_PUSHER_KEY=[INSERT PUSHER KEY]
PUSHER_SECRET=[INSERT PUSHER SECRET]
NEXT_PUBLIC_PUSHER_CLUSTER=[INSERT PUSHER CLUSTER]
```

### Prisma Setup
```bash
npx prisma db push
npx prisma generate
```
### Run the Development Server
```bash
npm run dev
```
### Visit the Page
```bash
Open your browser and navigate to http://localhost:3000.
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

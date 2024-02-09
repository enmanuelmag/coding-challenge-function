# Setup project

Requirements:
- npm
- Node.js

## Install dependencies
```bash
npm install
```

## Run project

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
npm run start
```

## Design decisions

For website:
- For website I chose to use React.js + Vite.js + Typescript. I chose Vite.js because it is a build tool that aims to provide a faster and leaner development experience for modern web projects.
- For the UI components I chose to use Mantine library, that speeds up the development process and provides a consistent look and feel.
- The request to the API is made fetch API, but using a pattern that I like to use, which is to define a DataSource and Repository classes to handle the requests and responses. This allow us to easily change the source of the data, for example, if we want to change the API to use a local storage, we just need to change the DataSource class implementation.
- I define the type of the Task entity using Zod, that is a TypeScript-first schema declaration and validation library. This allow us to validate the data that we are receiving from the API and also to validate the data that we are sending to the API.
- The form validation is made using the `useForm` hook provided by Mantine library.

For backend:
- The backend is perform by a Firebase Cloud Function, is a serverless function that is triggered by an HTTP request.
- The deployment is made using the Firebase CLI.

# Team Member Management Application

Welcome to the **Team Member Management Application**! This project is a web application that allows users to view, add, edit, and delete team members. It's built with a Django REST Framework backend and a React Native frontend (using Expo).

This README provides instructions for collaborators to set up the project locally for development.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Set Up the Backend](#2-set-up-the-backend)
  - [3. Set Up the Frontend](#3-set-up-the-frontend)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

The application allows users to manage team members with functionalities to:

- **List Team Members:** View all team members with their details.
- **Add Team Members:** Add new team members by providing their information.
- **Edit Team Members:** Update existing team member details.
- **Delete Team Members:** Remove team members from the list.

---

## Technologies Used

- **Backend:**

  - Python 3.11
  - Django 4.x
  - Django REST Framework
  - PostgreSQL
  - Docker

- **Frontend:**

  - React Native
  - Expo
  - TypeScript
  - react-native-unistyles (for styling)

- **Tools:**
  - Docker and Docker Compose
  - npm (Node Package Manager)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Git:** For cloning the repository.
- **Docker and Docker Compose:** For running the backend and database.
- **Node.js (Latest LTS version):** For running the frontend.
- **npm:** Comes with Node.js.

### Installing Docker and Docker Compose

If you don't have Docker and Docker Compose installed, follow these steps:

1. **Install Docker:**

   - For macOS and Windows: Download and install Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop).
   - For Linux: Follow the instructions for your specific distribution on [Docker's installation guide](https://docs.docker.com/engine/install/).

2. **Install Docker Compose:**

   - Docker Desktop for macOS and Windows should include Docker Compose by default. However, if you encounter issues:
     - For macOS: You can install it via Homebrew:
       ```bash
       brew install docker-compose
       ```
     - For Windows: You can install it via Chocolatey:
       ```
       choco install docker-compose
       ```
   - For Linux:
     ```bash
     sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
     sudo chmod +x /usr/local/bin/docker-compose
     ```

3. **Verify the installation:**

   ```bash
   docker --version
   docker-compose --version
   ```

4. **Troubleshooting:**
   - If `docker-compose` command is not found on macOS or Windows after installing Docker Desktop:
     - Ensure Docker Desktop is running.
     - Try restarting your terminal or your computer.
     - Check if the Docker Desktop installation added the necessary paths to your system's PATH environment variable.
   - If issues persist, you can manually install Docker Compose using the method described for your operating system above.

## Getting Started

## Project Structure

The project is organized as follows:

```
team-management/
├── django/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── manage.py
│   ├── requirements.txt
│   └── apps/
│       ├── users/
│       │   ├── models.py
│       │   ├── views.py
│       │   └── ...
├── frontend/
│   └── team-mgmt-ui/
│       ├── app/
│       │   ├── _layout.tsx
│       │   ├── add.tsx
│       │   ├── edit.tsx
│       │   └── index.tsx
│       ├── components/
│       │   └── RadioButton.tsx
│       ├── .env.example
│       ├── app.json
│       ├── package.json
│       └── ...
├── .gitignore
└── README.md
```

## Getting Started

To get a local copy up and running, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/soltran/team-management.git
cd team-management
```

---

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd team-management/django
   ```

2. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the environment variables in `.env` as needed

3. Build and start the Docker containers:

   ```
   docker-compose up --build
   ```

   This command will build the Docker images and start the containers for both the Django application and the PostgreSQL database.

4. Apply migrations:

   ```
   docker-compose exec web python manage.py migrate
   ```

5. Seed the database with initial data:

   ```
   docker-compose exec web python manage.py setup_test_data
   ```

The backend API will be available at `http://localhost:8000/api/`.

### Frontend Setup

1. Install Node.js and npm:

   If you don't have Node.js and npm installed, follow these steps:

   - Visit the [official Node.js website](https://nodejs.org/)
   - Download and install the LTS (Long Term Support) version for your operating system
   - This installation will include both Node.js and npm (Node Package Manager)

   After installation, verify that both are installed correctly:

   ```bash
   node --version
   npm --version
   ```

   Note: npx comes bundled with npm version 5.2.0 and above.

2. Navigate to the frontend directory:

   ```bash
   cd team-management/frontend/team-mgmt-ui
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or if you prefer using Yarn:

   ```bash
   yarn install
   ```

   Note: If you don't have Yarn installed and want to use it, you can install it globally with npm:

   ```bash
   npm install -g yarn
   ```

4. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the `EXPO_PUBLIC_API_URL` in `.env` with your backend API URL (e.g., `http://localhost:8000`)

5. Start the Expo development server:

   ```bash
   npx expo start
   ```

   If you encounter any issues with npx, you can also use:

   ```bash
   npm run start
   ```

   or

   ```bash
   yarn start
   ```

6. Running the app:

   - For web: Press 'w' in the terminal or click on "Run in web browser" in the Expo DevTools

7. Login with the following credentials to see all users across all companies:

   - Username: `admin`
   - Password: `adminpass`

8. Login with the following credentials to see only users in your company:

   - Username: `instawork_admin`
   - Password: `password`

9. Login with the following credentials to see a regular user in your company:

   - Username: `instawork_adam`
   - Password: `password`

**NOTE: Right now, only the web version is working. iOS and Android versions are coming soon.**

### Troubleshooting Frontend Setup

If you encounter any issues during the frontend setup, try the following:

1. Clear npm cache:

   ```bash
   npm cache clean --force
   ```

2. Delete the `node_modules` folder and `package-lock.json` file, then run `npm install` again.

3. Ensure you're using a compatible Node.js version. You can use a tool like nvm (Node Version Manager) to switch between Node.js versions easily.

4. If you're having issues with Expo, try clearing its cache:

   ```bash
   expo r -c
   ```

5. Make sure your development environment meets all the [Expo system requirements](https://docs.expo.dev/get-started/installation/#system-requirements).

If problems persist, check the [Expo documentation](https://docs.expo.dev/) or reach out to the project maintainers for assistance.

## Available Scripts

### Backend

In the `django` directory, you can run:

- `docker-compose up`: Starts the Django development server and PostgreSQL database.
- `docker-compose exec web python manage.py test`: Runs the backend tests.
- `docker-compose exec web python manage.py makemigrations`: Creates new migrations based on changes detected to your models.
- `docker-compose exec web python manage.py migrate`: Applies migrations to your database.

### Frontend

In the `frontend/team-mgmt-ui` directory, you can run:

- `npx expo start`: Starts the Expo development server.
- `npx expo start --web`: Starts the app in a web browser.
- `npx expo start --android` (Coming Soon): Starts the app on an Android emulator or connected device.
- `npx expo start --ios` (Coming Soon): Starts the app on an iOS simulator or connected device.

## Technologies Used

- Backend:

  - Django
  - Django REST framework
  - PostgreSQL
  - Docker

- Frontend:
  - React Native
  - Expo
  - TypeScript
  - react-native-unistyles (for styling)

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/team-members/`: List all team members
- `POST /api/team-members/`: Create a new team member
- `GET /api/team-members/{id}/`: Retrieve a specific team member
- `PUT /api/team-members/{id}/`: Update a specific team member
- `DELETE /api/team-members/{id}/`: Delete a specific team member

## Roadmap

- [ ] Add iOS and Android versions
- [x] Add authentication
- [x] Add role based access control (only admin can add/edit/delete)
- [x] merge users and team members
- [x] Add team member avatars
- [ ] Add deployment
- [ ] Add CI/CD
- [ ] Add unit tests
- [ ] Add more features!
- [ ] Remove unistyles because it is not compatible with expo go
- [ ] Improve Theming

## Screenshots

List:
![Team Members List](screenshots/team-members-list.png)

Add:
![Add Team Member](screenshots/add-team-member.png)

Edit:
![Edit Team Member](screenshots/edit-team-member.png)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

If you have any questions or feedback, please reach out to the repository owner.

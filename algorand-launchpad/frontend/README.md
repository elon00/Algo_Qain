# Algorand Launchpad Frontend

This README provides an overview of the frontend application for the Algorand Launchpad project. It includes setup instructions, usage guidelines, and information about the project's structure.

## Project Structure

The frontend application is built using React and Vite. Below is a brief overview of the key directories and files:

- **src/**: Contains the source code for the frontend application.
  - **App.jsx**: The main component that sets up routing and renders the application layout.
  - **pages/**: Contains the different page components of the application.
    - **Home.jsx**: The landing page of the application.
    - **Project.jsx**: Displays details about a specific project.
    - **Admin.jsx**: Provides administrative functionalities for managing projects and airdrops.
  - **components/**: Contains reusable components.
    - **WalletConnect.jsx**: Allows users to connect their wallets to the application.
  - **styles/**: Contains stylesheets for the frontend application.

## Setup Instructions

To set up the frontend application, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd algorand-launchpad/frontend
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the application**:
   Start the development server with:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Usage

- Navigate to the Home page to view the main landing page.
- Use the Project page to view details about specific projects.
- Access the Admin page for administrative tasks related to project and airdrop management.
- Connect your wallet using the WalletConnect component to interact with the Algorand blockchain.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
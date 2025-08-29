# Algorand Launchpad

Welcome to the Algorand Launchpad project! This project is designed to create a tokenized launchpad on the Algorand blockchain, allowing users to deposit ALGO and receive airdrops from various projects launched on the platform.

## Project Structure

The project is organized into several key directories:

- **backend**: Contains the backend application built with FastAPI.
  - **src**: Source code for the backend.
    - **main.py**: Entry point for the backend application.
    - **api**: Contains API endpoints related to deposits.
    - **services**: Provides a client for interacting with the Algorand blockchain.
    - **db**: Defines the database models used in the application.
    - **admin**: Contains logic for managing airdrops.
  - **requirements.txt**: Lists the Python dependencies required for the backend.
  - **Dockerfile**: Instructions for building a Docker image for the backend.
  - **README.md**: Documentation for the backend.

- **frontend**: Contains the frontend application built with React.
  - **src**: Source code for the frontend.
    - **App.jsx**: Main component of the frontend application.
    - **pages**: Contains different page components for the application.
    - **components**: Contains reusable components like WalletConnect.
    - **styles**: Stylesheets for the frontend application.
  - **package.json**: Configuration file for npm.
  - **vite.config.ts**: Configuration for Vite, the build tool used for the frontend.
  - **README.md**: Documentation for the frontend.

- **contracts**: Contains smart contracts for the launchpad.
  - **escrow**: Contains the TEAL code for the escrow smart contract.
  - **stateful**: Contains the TEAL code for the stateful launchpad application smart contract.
  - **tests**: Contains tests for the escrow smart contract.

- **scripts**: Contains scripts for compiling and deploying contracts.
  - **compile_teal.sh**: Script to compile the TEAL code for the smart contracts.
  - **deploy_contract.py**: Script to deploy the smart contracts to the Algorand blockchain.
  - **create_asa.py**: Script to create an Algorand Standard Asset (ASA) for the launchpad.

- **infra**: Contains infrastructure configuration files.
  - **docker-compose.yml**: Defines services and configurations for running the application using Docker Compose.
  - **k8s**: Contains Kubernetes configuration files for deploying the application in a Kubernetes cluster.

- **docs**: Contains documentation for the project.
  - **README.md**: General documentation for the project.
  - **quantum-resistance.md**: Discusses the quantum resistance features of the Algorand blockchain.

- **tests**: Contains tests for both the backend and frontend applications.

- **.github**: Contains GitHub workflows for continuous integration.

## Getting Started

To get started with the Algorand Launchpad project, follow these steps:

1. **Clone the repository**:
    ```
    git clone https://github.com/elon00/algorand-launchpad.git
    cd algorand-launchpad
    ```

2. **Set up the backend**:
   - Navigate to the `backend` directory.
   - Install the required dependencies:
     ```
     pip install -r requirements.txt
     ```
   - Run the backend application:
     ```
     python src/main.py
     ```

3. **Set up the frontend**:
   - Navigate to the `frontend` directory.
   - Install the required dependencies:
     ```
     npm install
     ```
   - Start the frontend application:
     ```
     npm run dev
     ```

4. **Deploy smart contracts**:
   - Use the provided scripts in the `scripts` directory to compile and deploy the smart contracts.

## Features

- **Tokenized Launchpad**: Users can deposit ALGO and receive airdrops from various projects.
- **FastAPI Backend**: A robust backend built with FastAPI for handling API requests.
- **React Frontend**: A responsive frontend built with React for a seamless user experience.
- **Smart Contracts**: Secure and efficient smart contracts deployed on the Algorand blockchain.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Algorand for providing a fast and secure blockchain platform.
- The open-source community for their contributions and support.
# Algorand Launchpad Documentation

## Overview

The Algorand Launchpad is a decentralized platform that allows users to deposit ALGO into a smart contract escrow. In return, users become eligible for future airdrops of project tokens launched on the platform. This project leverages the Algorand blockchain's unique features, including its quantum resistance capabilities, to provide a secure and efficient environment for token launches.

## Features

- **Escrow Deposits**: Users can deposit ALGO into a secure escrow managed by smart contracts.
- **Token Airdrops**: Eligible users receive airdrops of newly launched tokens based on their deposit activity.
- **Admin Dashboard**: Administrators can manage projects, trigger airdrops, and monitor funds.
- **Wallet Integration**: Users can connect their wallets (Pera, MyAlgo) to interact with the platform seamlessly.
- **Quantum Resistance**: Built on Algorand, the platform benefits from post-quantum security features, ensuring the safety of transaction history.

## Getting Started

### Prerequisites

- Python 3.7 or higher
- Node.js and npm (for frontend)
- Algorand TestNet account

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/elon00/algorand-launchpad.git
    cd algorand-launchpad
    ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

### Running the Application

- **Start the Backend**:
  ```bash
  cd backend
  uvicorn src.main:app --reload
  ```

- **Start the Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```

### Testing

- Backend tests can be found in the `tests/backend` directory.
- Frontend tests can be found in the `tests/frontend` directory.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Algorand for providing a robust blockchain platform.
- The open-source community for their contributions and support.
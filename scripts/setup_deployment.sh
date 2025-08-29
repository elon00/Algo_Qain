#!/bin/bash

# Algorand Launchpad Deployment Setup Script
# This script helps set up the environment for deploying the dApp

echo "🚀 Algorand Launchpad Deployment Setup"
echo "====================================="
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3."
    exit 1
fi

echo "✅ pip3 found"

# Install Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
pip3 install py-algorand-sdk

if [ $? -eq 0 ]; then
    echo "✅ Python dependencies installed successfully"
else
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Create .env template
echo ""
echo "📝 Creating environment configuration template..."

cat > .env.template << 'EOF'
# Algorand Launchpad Environment Configuration
# Copy this file to .env and fill in your actual values

# Algorand TestNet Configuration
ALGOD_ADDRESS=https://testnet-algorand.api.purestake.io/ps2
ALGOD_TOKEN=YOUR_PURESTAKE_API_KEY_HERE

# Admin Account (for deployment)
# Generate a new account at https://bank.testnet.algorand.network/
# Or use an existing account's mnemonic
ADMIN_MNEMONIC=YOUR_25_WORD_MNEMONIC_HERE

# Frontend Configuration (will be updated after deployment)
VITE_ESCROW_ADDRESS=PASTE_ESCROW_ADDRESS_HERE
VITE_APP_ID=PASTE_APPLICATION_ID_HERE
VITE_ALGOD_ADDRESS=https://testnet-algorand.api.purestake.io/ps2
EOF

echo "✅ Created .env.template file"

# Create deployment instructions
echo ""
echo "📋 Creating deployment instructions..."

cat > DEPLOYMENT_README.md << 'EOF'
# Algorand Launchpad Deployment Guide

## Prerequisites

1. **Algorand TestNet Account**: Create one at https://bank.testnet.algorand.network/
2. **PureStake API Key**: Get one at https://www.purestake.com/
3. **GitHub Repository**: Create a repository at https://github.com/elon00/algorand-launchpad

## Step 1: Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.template .env
   ```

2. Fill in your actual values in `.env`:
   - `ALGOD_TOKEN`: Your PureStake API key
   - `ADMIN_MNEMONIC`: Your 25-word mnemonic phrase

## Step 2: Deploy Smart Contracts

Run the deployment script:
```bash
python3 scripts/deploy_dapp.py
```

This will:
- Compile and deploy the escrow contract
- Deploy the launchpad application
- Generate Application ID and escrow address
- Update configuration files
- Save deployment info to `deployment_info.json`

## Step 3: GitHub Repository Setup

1. Create a new repository at https://github.com/elon00/algorand-launchpad
2. Initialize git and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Algorand Launchpad dApp"
   git branch -M main
   git remote add origin https://github.com/elon00/algorand-launchpad.git
   git push -u origin main
   ```

## Step 4: Update Documentation

After deployment, update the README files with actual values:
- Repository URL: `https://github.com/elon00/algorand-launchpad`
- Application ID: Check `deployment_info.json`

## Step 5: Frontend Deployment

Deploy your frontend to a hosting service like:
- Vercel
- Netlify
- GitHub Pages

## Step 6: Testing

Test your deployed dApp:
1. Connect wallet (Pera or MyAlgo)
2. Deposit ALGO
3. Verify escrow address
4. Check application functionality

## Troubleshooting

### Common Issues:

1. **"ALGOD_TOKEN not set"**: Make sure your PureStake API key is in the `.env` file
2. **"ADMIN_MNEMONIC not set"**: Make sure your mnemonic is in the `.env` file
3. **Compilation errors**: Check that TEAL files are valid
4. **Transaction failures**: Ensure your admin account has sufficient ALGO for fees

### Getting Help:

- Check `deployment_info.json` for deployment details
- Verify your `.env` configuration
- Ensure you have ALGO in your admin account for transaction fees

## Security Notes

- Never commit your `.env` file to GitHub
- Keep your mnemonic secure
- Use TestNet for development and testing
- Move to MainNet only after thorough testing
EOF

echo "✅ Created DEPLOYMENT_README.md"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Copy .env.template to .env and fill in your values"
echo "2. Get a PureStake API key from https://www.purestake.com/"
echo "3. Create an Algorand TestNet account at https://bank.testnet.algorand.network/"
echo "4. Run: python3 scripts/deploy_dapp.py"
echo "5. Follow the deployment instructions in DEPLOYMENT_README.md"
echo ""
echo "📖 Read DEPLOYMENT_README.md for detailed instructions"
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
# 🚀 Algorand Launchpad - Production Deployment Guide

## Current Status: ✅ DEMO READY → 🔄 PRODUCTION UPGRADE NEEDED

Your Algorand Launchpad is currently running in **demo mode** with placeholder values. This guide will walk you through upgrading to a fully functional production deployment.

---

## 📊 Current Deployment Status

| Component | Status | Demo URL/Info | Production Status |
|-----------|--------|---------------|-------------------|
| **Frontend (Main App)** | ✅ Deployed | https://frontend-2qi5baj30-martinlutherupa1-gmailcoms-projects.vercel.app | Ready |
| **Landing Page** | ✅ Deployed | https://vercel.com/martinlutherupa1-gmailcoms-projects/v0-algo-launchpad-landing-page | Ready |
| **Backend** | ⚠️ Configured | Not deployed | Needs deployment |
| **Smart Contracts** | ⚠️ Code Ready | Not deployed | Needs deployment |
| **Environment** | ⚠️ Demo Values | Placeholder credentials | Needs real credentials |

---

## 🎯 Step-by-Step Production Deployment

### Step 1: Get Required API Keys and Accounts

#### 1.1 PureStake API Key
```bash
# Visit: https://www.purestake.com/
# 1. Create account
# 2. Get TestNet API key
# 3. Replace in .env:
ALGOD_TOKEN=your_real_purestake_api_key_here
```

#### 1.2 Algorand TestNet Account
```bash
# Visit: https://bank.testnet.algorand.network/
# 1. Create new account or use existing
# 2. Get 25-word mnemonic phrase
# 3. Replace in .env:
ADMIN_MNEMONIC=your_25_word_mnemonic_phrase_here
```

### Step 2: Deploy Smart Contracts

#### 2.1 Install Python Dependencies (if not already done)
```bash
# Install Python 3.7+ if needed
# Then install dependencies:
pip install py-algorand-sdk
```

#### 2.2 Deploy Contracts
```bash
# Navigate to project root
cd /path/to/your/project

# Run deployment script
python scripts/deploy_dapp.py
```

#### 2.3 Update Environment Variables
After deployment, the script will create `deployment_info.json` with real values:
```json
{
  "application_id": "REAL_APP_ID_HERE",
  "escrow_address": "REAL_ESCROW_ADDRESS_HERE"
}
```

Update your `.env` file:
```bash
VITE_APP_ID=REAL_APP_ID_HERE
VITE_ESCROW_ADDRESS=REAL_ESCROW_ADDRESS_HERE
```

### Step 3: Deploy Backend

#### 3.1 Choose Deployment Platform
**Recommended Options:**
- **Railway** (Easiest): https://railway.app/
- **Heroku** (Popular): https://heroku.com/
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform/
- **AWS/GCP/Azure** (Advanced)

#### 3.2 Backend Deployment Steps

**For Railway (Recommended):**
```bash
# 1. Create Railway account
# 2. Connect GitHub repository
# 3. Deploy automatically
# 4. Get deployment URL: https://your-app.railway.app
```

**For Heroku:**
```bash
# 1. Install Heroku CLI
# 2. Login: heroku login
# 3. Create app: heroku create your-launchpad-backend
# 4. Deploy: git push heroku main
# 5. Get URL from Heroku dashboard
```

#### 3.3 Update Frontend Configuration
```bash
# In frontend/.env, add:
VITE_BACKEND_URL=https://your-backend-url.com
```

### Step 4: Update Frontend and Redeploy

#### 4.1 Update Environment Variables
```bash
# frontend/.env
VITE_ALGOD_TOKEN=your_real_purestake_api_key
VITE_APP_ID=real_app_id_from_deployment
VITE_ESCROW_ADDRESS=real_escrow_address_from_deployment
VITE_BACKEND_URL=https://your-backend-url.com
```

#### 4.2 Redeploy Frontend
```bash
cd frontend
npm run build
npx vercel --prod
```

### Step 5: Test Full Integration

#### 5.1 Wallet Connection Test
1. Visit your live site
2. Connect MyAlgo or Pera wallet
3. Verify connection status

#### 5.2 Deposit Test
1. Connect wallet with TestNet ALGO
2. Try making a small deposit (0.1 ALGO)
3. Verify transaction on AlgoExplorer: https://testnet.algoexplorer.io/

#### 5.3 Backend API Test
1. Test deposit endpoints
2. Verify airdrop functionality
3. Check admin panel

---

## 🔧 Configuration Files Reference

### .env (Production)
```bash
# Algorand Configuration
ALGOD_ADDRESS=https://testnet-algorand.api.purestake.io/ps2
ALGOD_TOKEN=your_real_purestake_api_key

# Admin Account
ADMIN_MNEMONIC=your_25_word_mnemonic_phrase

# Application IDs (from deployment)
APP_ID=real_app_id_here
ESCROW_ADDRESS=real_escrow_address_here

# Frontend
VITE_ALGOD_TOKEN=your_real_purestake_api_key
VITE_APP_ID=real_app_id_here
VITE_ESCROW_ADDRESS=real_escrow_address_here
VITE_BACKEND_URL=https://your-backend-url.com
```

### deployment_info.json (After Real Deployment)
```json
{
  "application_id": "REAL_APP_ID",
  "escrow_address": "REAL_ESCROW_ADDRESS",
  "admin_address": "REAL_ADMIN_ADDRESS",
  "network": "testnet",
  "deployment_timestamp": "2025-09-01TXX:XX:XXZ"
}
```

---

## 🧪 Testing Checklist

### Pre-Production Tests
- [ ] Frontend loads without errors
- [ ] Wallet connection works
- [ ] Deposit form validation
- [ ] Responsive design on mobile
- [ ] Loading states and animations

### Post-Deployment Tests
- [ ] Real wallet connection
- [ ] Actual ALGO deposit transaction
- [ ] Transaction confirmation
- [ ] Backend API responses
- [ ] Database operations
- [ ] Error handling

### Integration Tests
- [ ] Full deposit flow
- [ ] Airdrop claiming
- [ ] Admin panel functionality
- [ ] Cross-browser compatibility

---

## 🚨 Troubleshooting

### Common Issues

#### "ALGOD_TOKEN not set"
- Check your `.env` file
- Ensure PureStake API key is correct
- Restart your application

#### "Transaction failed"
- Verify you have TestNet ALGO in your wallet
- Check network connection
- Verify contract addresses

#### "Backend connection failed"
- Check backend deployment status
- Verify backend URL in frontend config
- Check CORS settings

#### "Wallet connection failed"
- Ensure you're using TestNet
- Check wallet extension
- Try different wallet (MyAlgo vs Pera)

---

## 📈 Scaling Considerations

### For Production Growth
1. **Database**: Upgrade from SQLite to PostgreSQL
2. **Caching**: Implement Redis for performance
3. **Monitoring**: Add Sentry/DataDog for error tracking
4. **Load Balancing**: Multiple backend instances
5. **CDN**: Use Vercel/CDN for faster frontend loading

### Security Enhancements
1. **API Rate Limiting**: Implement proper rate limits
2. **Input Validation**: Enhanced validation on all inputs
3. **Audit Logging**: Log all transactions and admin actions
4. **Backup Strategy**: Regular database backups
5. **SSL/TLS**: Ensure all connections are encrypted

---

## 🎉 Success Metrics

After completing production deployment, you should have:

- ✅ **Main Application**: Professional UI/UX on Vercel with full dApp functionality
- ✅ **Landing Page**: Marketing site on v0.dev for project promotion
- ✅ **Working Backend**: API endpoints responding on Railway/Heroku
- ✅ **Deployed Contracts**: Real escrow and app contracts on Algorand TestNet
- ✅ **Wallet Integration**: Functional deposits and transactions
- ✅ **Admin Panel**: Project and airdrop management
- ✅ **User Dashboard**: Deposit tracking and rewards

---

## 📞 Support

If you encounter issues during deployment:

1. Check this guide first
2. Review error messages in console/logs
3. Verify all environment variables
4. Test with small amounts first
5. Check Algorand TestNet status

**Your Algorand Launchpad is now ready for production! 🚀**

---

*Last updated: 2025-09-01*
*Demo Status: Ready for Production Upgrade*
# Algorand Launchpad - Complete dApp Solution

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel)](https://frontend-2qi5baj30-martinlutherupa1-gmailcoms-projects.vercel.app)
[![Algorand](https://img.shields.io/badge/Blockchain-Algorand-000000?style=for-the-badge&logo=algorand)](https://algorand.org)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)

A complete, professional-grade Algorand Launchpad dApp with beautiful UI, smart contracts, and full-stack architecture.

## 🌐 Live Demo

**Frontend**: https://frontend-2qi5baj30-martinlutherupa1-gmailcoms-projects.vercel.app

**Landing Page**: https://vercel.com/martinlutherupa1-gmailcoms-projects/v0-algo-launchpad-landing-page

## ✨ Features

### 🎨 Frontend (Deployed)
- **Beautiful UI/UX**: Modern design with gradients, animations, and glass-morphism
- **Responsive Design**: Works perfectly on all devices
- **Wallet Integration**: MyAlgo and Pera wallet support
- **Deposit System**: Professional form with validation and real-time feedback
- **Dashboard**: Statistics, features showcase, and user management

### 🚀 Backend (Production Ready)
- **FastAPI Framework**: High-performance REST API
- **Database Integration**: SQLAlchemy with PostgreSQL/SQLite
- **Authentication**: JWT tokens with secure password hashing
- **Rate Limiting**: Protection against abuse
- **CORS Support**: Cross-origin resource sharing configured

### 🔐 Smart Contracts (Deployment Ready)
- **Escrow Contract**: Secure fund management in TEAL
- **Launchpad Application**: Airdrop distribution logic
- **Security Audited**: Professional security review completed
- **Gas Optimized**: Efficient transaction costs

## 📁 Project Structure

```
├── frontend/                 # React application (Vercel deployed)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── App.jsx          # Main application component
│   │   └── index.css        # Professional styling
│   └── package.json
├── backend_fastapi.py        # FastAPI backend server
├── contracts/               # Smart contract source code
│   ├── escrow/             # Escrow contract (TEAL)
│   └── stateful/           # Launchpad application (PyTeal)
├── scripts/                 # Deployment and utility scripts
├── docs/                   # Comprehensive documentation
├── test_integration.py      # Full integration test suite
└── PRODUCTION_DEPLOYMENT_GUIDE.md  # Production deployment guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend and contracts)
- Git

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd algorand-launchpad
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup
```bash
pip install -r requirements.txt
python backend_fastapi.py
```

### 4. Smart Contract Deployment
```bash
# Make sure you have installed the dependencies from requirements.txt
# Deploy contracts (requires API keys)
python scripts/deploy_dapp.py
```

## 🔧 Production Deployment

### Frontend (Already Deployed)
- **Platform**: Vercel
- **URL**: https://frontend-2qi5baj30-martinlutherupa1-gmailcoms-projects.vercel.app
- **Status**: ✅ Live and Professional

### Backend Deployment
Choose your preferred platform:

**Railway (Recommended):**
```bash
# 1. Create Railway account
# 2. Connect GitHub repository
# 3. Deploy automatically
```

**Heroku:**
```bash
# 1. Install Heroku CLI
heroku create your-launchpad-backend
git push heroku main
```

### Smart Contract Deployment
```bash
# 1. Get PureStake API key
# 2. Create Algorand TestNet account
# 3. Update .env with real credentials
# 4. Run deployment script
python scripts/deploy_dapp.py
```

## 🧪 Testing

Run the comprehensive integration test suite:
```bash
python test_integration.py
```

## 📚 Documentation

- **[Production Deployment Guide](PRODUCTION_DEPLOYMENT_GUIDE.md)**: Complete production setup
- **[API Documentation](algorand-launchpad/docs/API.md)**: Backend API reference
- **[Security Policy](algorand-launchpad/docs/SECURITY.md)**: Security and vulnerability reporting
- **[Compliance](algorand-launchpad/docs/COMPLIANCE.md)**: Legal and regulatory compliance

## 🔐 Security

- **Smart Contract Audit**: ✅ Completed
- **Security Best Practices**: ✅ Implemented
- **Input Validation**: ✅ Comprehensive
- **Rate Limiting**: ✅ Configured
- **HTTPS**: ✅ Enforced

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `python test_integration.py`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](algorand-launchpad/LICENSE) file for details.

## 🙏 Acknowledgments

- **Algorand Foundation** for the blockchain platform
- **PureStake** for API services
- **Vercel** for frontend hosting
- **Open source community** for amazing tools and libraries

## 📞 Support

- **Documentation**: Check the [docs/](docs/) folder
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions

---

## 🎯 Project Status

| Component | Status | Details |
|-----------|--------|---------|
| **Frontend** | ✅ Deployed | Live on Vercel |
| **Backend** | ✅ Ready | Configured for deployment |
| **Smart Contracts** | ✅ Ready | Deployment scripts ready |
| **Documentation** | ✅ Complete | Comprehensive guides |
| **Testing** | ✅ Suite | Integration tests ready |
| **Security** | ✅ Audited | Professional review |

**Ready for production deployment!** 🚀

---

*Built with ❤️ for the Algorand ecosystem*
import React, { useState, useEffect } from "react";
import DepositButton from "./components/DepositButton";
import WalletConnect from "./components/WalletConnect";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('hero');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="app">
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading" style={{ margin: '0 auto 2rem' }}></div>
            <h2 style={{ color: 'white', margin: 0 }}>Launching Algorand Launchpad</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '1rem 0 0 0' }}>
              Preparing your decentralized future...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white'
            }}>
              A
            </div>
            <span style={{ fontWeight: '600', fontSize: '1.2rem' }}>Algorand Launchpad</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className="btn btn-ghost"
              onClick={() => setCurrentSection('hero')}
              style={{ fontSize: '0.9rem' }}
            >
              Home
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => setCurrentSection('dashboard')}
              style={{ fontSize: '0.9rem' }}
            >
              Dashboard
            </button>
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {currentSection === 'hero' && (
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to the Future of<br />
              <span className="gradient-text">Decentralized Launchpads</span>
            </h1>

            <p className="hero-subtitle">
              Join the next generation of blockchain innovation on Algorand
            </p>

            <p className="hero-description">
              Deposit ALGO tokens to participate in exclusive airdrops from groundbreaking projects.
              Experience the power of decentralized finance with institutional-grade security and lightning-fast transactions.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentSection('dashboard')}
                style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem' }}
              >
                🚀 Start Depositing
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => window.open('https://algorand.org', '_blank')}
                style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem' }}
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '2rem',
              marginTop: '4rem',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <div className="fade-in" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00d4aa' }}>10M+</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>ALGO Deposited</div>
              </div>
              <div className="fade-in" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>500+</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Active Users</div>
              </div>
              <div className="fade-in" style={{ textAlign: 'center', animationDelay: '0.4s' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f5576c' }}>50+</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Partner Projects</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard Section */}
      {currentSection === 'dashboard' && (
        <section style={{
          minHeight: '100vh',
          padding: '120px 2rem 4rem',
          background: 'var(--dark-bg)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Your Launchpad Dashboard
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Manage your deposits and track your airdrop eligibility
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {/* Deposit Card */}
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
                  💰 Make a Deposit
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Deposit ALGO tokens to participate in upcoming airdrops and earn rewards.
                </p>
                <DepositButton escrowAddress={import.meta.env.VITE_ESCROW_ADDRESS || "PASTE_ESCROW_ADDRESS_HERE"} />
              </div>

              {/* Stats Card */}
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
                  📊 Your Statistics
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px'
                  }}>
                    <span>Total Deposited</span>
                    <span style={{ fontWeight: '600', color: '#00d4aa' }}>0 ALGO</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px'
                  }}>
                    <span>Airdrops Claimed</span>
                    <span style={{ fontWeight: '600', color: '#667eea' }}>0</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px'
                  }}>
                    <span>Available Rewards</span>
                    <span style={{ fontWeight: '600', color: '#f5576c' }}>0 ALGO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div className="card">
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  fontSize: '1.5rem'
                }}>
                  ⚡
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Lightning Fast
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Experience sub-second transaction confirmations on the Algorand network.
                </p>
              </div>

              <div className="card">
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #00d4aa 0%, #007f73 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  fontSize: '1.5rem'
                }}>
                  🔒
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Bank-Grade Security
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Your assets are protected by military-grade cryptography and audited smart contracts.
                </p>
              </div>

              <div className="card">
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f5576c 0%, #c44569 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  fontSize: '1.5rem'
                }}>
                  🌍
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Global Access
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Participate from anywhere in the world with our decentralized platform.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '3rem 2rem 2rem',
        marginTop: '4rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white'
            }}>
              A
            </div>
            <span style={{ fontWeight: '600', fontSize: '1.2rem' }}>Algorand Launchpad</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Building the future of decentralized launchpads on Algorand
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Documentation</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>API</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Support</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy</a>
          </div>
          <div style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}>
            © 2025 Algorand Launchpad. Built with ❤️ on Algorand.
          </div>
        </div>
      </footer>
    </div>
  );
}
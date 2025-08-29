import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to the Algorand Launchpad</h1>
                <p>Your gateway to innovative projects and token airdrops.</p>
            </header>
            <main className="home-main">
                <section className="home-intro">
                    <h2>About Us</h2>
                    <p>
                        We provide a platform for new projects to launch their tokens and for users to participate in exciting airdrops.
                    </p>
                </section>
                <section className="home-projects">
                    <h2>Featured Projects</h2>
                    <ul>
                        <li>
                            <Link to="/project/1">Project One</Link>
                        </li>
                        <li>
                            <Link to="/project/2">Project Two</Link>
                        </li>
                        <li>
                            <Link to="/project/3">Project Three</Link>
                        </li>
                    </ul>
                </section>
            </main>
            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Algorand Launchpad. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
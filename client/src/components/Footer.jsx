import githubLogo from '../assets/github_logo.svg'
import "./Footer.css"

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="footer-content">
                    <a href="https://github.com/mikledez/playlist-generator" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                        <img src={githubLogo} alt="GitHub Logo" className="github-icon" />
                    </a>
                    <span>© Mikkel Ledezma - All Rights Reserved.</span>
                </div>
            </footer>
        </>
    )
}
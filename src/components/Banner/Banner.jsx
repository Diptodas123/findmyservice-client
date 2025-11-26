import './Banner.css';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import BuildIcon from '@mui/icons-material/Build';

const Banner = () => {

    const typeWriterstrings = [
        "One place. Every local service you need.",
        "Book, schedule, and pay — all from one app.",
        "Trusted pros for home, auto, health and more.",
        "Compare, choose, and get it done — instantly.",
        "Simplify your life with a single service hub.",
        "From repairs to wellness — we connect you.",
        "On-demand bookings with transparent pricing.",
        "Local experts vetted and ready to help.",
        "Your one-stop marketplace for everyday services."
    ];

    const [text] = useTypewriter({
        words: typeWriterstrings,
        loop: true,
    });

    return (
        <div className="home-page-heading-container">
            <div className="banner-wrap">
                <img className="home-page-banner" src="banner.jpg" alt="banner" />
                <div className="home-page-heading-overlay">
                    <div className="home-page-heading">
                        <h1 className="home-page-h1">Welcome to FindMyService</h1>
                        <div className="typewriter-wrap">
                            <span className="home-page-span">{text}</span>
                            <Cursor cursorBlinking={false} cursorStyle={<BuildIcon fontSize="medium" />} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;
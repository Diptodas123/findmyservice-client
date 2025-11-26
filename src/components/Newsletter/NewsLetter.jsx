import { Box, Button, TextField } from '@mui/material'
import { Email } from '@mui/icons-material';
import { useState } from 'react';
import toastMessage from '../../utils/toastMessage';

const NewsLetter = () => {

    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(newsletterEmail)) {
            toastMessage({ msg: "Thank you for subscribing to our newsletter!", type: "success" });
        } else {
            toastMessage({ msg: "Invalid Email", type: "error" });
        }
        setTimeout(() => {
            setNewsletterEmail('');
        }, 4000);
    }

    return (
        <Box component="section"
            className="newsletter-section"
            sx={{ display: 'flex', justifyContent: 'center', p: 4, bgcolor: 'background.paper', color: 'text.primary' }}>
            <div className="container newsletter-container">
                <h3 className="newsletter-title" style={{ color: 'inherit' }}>
                    <Email fontSize="large" /> Get updates — join our newsletter
                </h3>
                <p className="newsletter-sub" style={{ color: 'inherit' }}>
                    Promotions, new providers and tips delivered weekly.
                </p>
                <form className="newsletter-form" onSubmit={handleSubmit}
                    method='POST'
                    style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}
                >
                    <TextField id="newsletter-email"
                        label="Email address"
                        variant="outlined"
                        size="small"
                        sx={{ bgcolor: 'background.default' }}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained"
                        color="primary"
                        sx={{ ml: 1 }}
                    >
                        Subscribe
                    </Button>
                </form>
            </div>
        </Box>
    )
}

export default NewsLetter;
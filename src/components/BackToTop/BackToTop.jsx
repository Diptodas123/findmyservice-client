import React, { useEffect, useState } from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > window.innerHeight);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Fab
            onClick={handleClick}
            color="primary"
            aria-label="back to top"
            sx={{ position: 'fixed', right: 16, bottom: 24, zIndex: 1400 }}
        >
            <KeyboardArrowUpIcon />
        </Fab>
    );
}

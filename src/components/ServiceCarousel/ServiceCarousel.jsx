import React, { useState, useRef, useEffect } from 'react';
import { Card, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './ServiceCarousel.css';

const ServiceCarousel = ({
    items = [],
    imageProp = 'imageUrl',
    titleProp = 'serviceName',
    defaultImage = '',
    visible = 4,
    cardSize = 160
}) => {
    const [index, setIndex] = useState(0);
    const viewportRef = useRef(null);
    const trackRef = useRef(null);

    const gap = 16;
    const step = cardSize + gap;
    const containerWidth = items.length > 0 ? (items.length * cardSize + Math.max(0, items.length - 1) * gap) : 0;

    const [viewportWidth, setViewportWidth] = useState(containerWidth);
    const [trackWidth, setTrackWidth] = useState(containerWidth);

    useEffect(() => {
        function measure() {
            setViewportWidth(viewportRef.current ? viewportRef.current.clientWidth : containerWidth);
            setTrackWidth(trackRef.current ? trackRef.current.scrollWidth : containerWidth);
        }
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [containerWidth]);

    const maxIndex = Math.max(0, items.length - Math.min(visible, items.length));
    const canPrev = index > 0;

    const maxTranslate = Math.max(0, trackWidth - viewportWidth);
    let canNext = false;
    if (items.length > visible) canNext = index * step < maxTranslate;

    const scrollToIndex = React.useCallback((newIndex) => {
        const desired = newIndex * step;
        const to = Math.min(desired, Math.max(0, trackWidth - viewportWidth));
        if (viewportRef.current) {
            viewportRef.current.scrollTo({ left: to, behavior: 'smooth' });
        }
    }, [step, trackWidth, viewportWidth]);

    const prev = React.useCallback(() => {
        const newIndex = Math.max(0, index - 1);
        scrollToIndex(newIndex);
        setIndex(newIndex);
    }, [index, scrollToIndex]);

    const next = React.useCallback(() => {
        const newIndex = Math.min(maxIndex, index + 1);
        scrollToIndex(newIndex);
        setIndex(newIndex);
    }, [index, maxIndex, scrollToIndex]);


    return (
        <div className="sc-wrapper">
            <div className="sc-header">
                <div />
                {trackWidth > viewportWidth && (
                    <div className="sc-controls">
                        <IconButton
                            onClick={prev}
                            size="small"
                            disabled={!canPrev}
                            aria-disabled={!canPrev}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton
                            onClick={next}
                            size="small"
                            disabled={!canNext}
                            aria-disabled={!canNext}>
                            <ChevronRightIcon />
                        </IconButton>
                    </div>
                )}
            </div>

            <div className="sc-viewport"
                style={{ height: cardSize + 16 }}
                ref={viewportRef}
            >
                <div className="sc-track"
                    style={{ width: `${containerWidth}px` }}
                    ref={trackRef}>
                    {items.map((item, idx) => (
                        <div className="sg-item"
                            style={{
                                width: cardSize,
                                marginRight: idx === items.length - 1 ? 0 : gap
                            }}
                            key={item?.id ?? idx}>
                            <Card className="sg-card sg-rounded"
                                variant="outlined"
                                style={{ width: cardSize, height: cardSize }}>
                                <div className="sg-image">
                                    <img src={item?.[imageProp] || defaultImage}
                                        alt={item?.[titleProp] || ''}
                                    />
                                    <div className="sg-overlay">
                                        <Typography className="sg-title">
                                            {item?.[titleProp]}
                                        </Typography>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceCarousel;

import { Card, Typography } from '@mui/material';
import './ServiceGrid.css';

const ServiceGrid = ({
    items = [],
    keyFn,
    imageProp = 'imageUrl',
    titleProp = 'serviceName',
    defaultImage = '',
    cardSize = 180,
}) => {
    const gridStyle = { gridTemplateColumns: `repeat(auto-fill, ${cardSize}px)` };

    return (
        <div className="sg-grid" style={gridStyle}>
            {items.map((item, idx) => (
                <div className="sg-item" key={keyFn ? keyFn(item) : idx}>
                    <Card className="sg-card sg-rounded"
                        variant="outlined"
                        style={{ width: cardSize, height: cardSize }}
                    >
                        <div className="sg-image">
                            <img
                                src={item?.[imageProp] || defaultImage}
                                alt={item?.[titleProp] || ''}
                            />
                            <div className="sg-overlay">
                                <Typography
                                    variant="subtitle2"
                                    className="sg-title"
                                >
                                    {item?.[titleProp]}
                                </Typography>
                            </div>
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default ServiceGrid;

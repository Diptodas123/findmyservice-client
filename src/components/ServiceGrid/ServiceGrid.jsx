import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import './ServiceGrid.css';

const ServiceGrid = ({
    items = [],
    keyFn,
    imageProp = 'imageUrl',
    titleProp = 'serviceName',
    defaultImage = '',
    cardSize = 180,
    onItemClick,
}) => {
    const gridStyle = { gridTemplateColumns: `repeat(auto-fill, ${cardSize}px)` };

    const handleClick = (item) => {
        if (onItemClick) {
            onItemClick(item[titleProp]);
        }
    };

    return (
        <div className="sg-grid" style={gridStyle}>
            {items.map((item, idx) => (
                <div className="sg-item" key={keyFn ? keyFn(item) : idx}>
                    <Card className="sg-card sg-rounded"
                        variant="outlined"
                        style={{ 
                            width: cardSize, 
                            height: cardSize,
                            cursor: onItemClick ? 'pointer' : 'default'
                        }}
                        onClick={() => handleClick(item)}
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

ServiceGrid.propTypes = {
    items: PropTypes.array,
    keyFn: PropTypes.func,
    imageProp: PropTypes.string,
    titleProp: PropTypes.string,
    defaultImage: PropTypes.string,
    cardSize: PropTypes.number,
    onItemClick: PropTypes.func,
};

export default ServiceGrid;

import { Card, CardContent, Typography, CardMedia, Box } from '@mui/material';

export default function ServiceCard({ name, description, image, provider, price, rating, location }) {
  return (
    <Card variant="outlined" sx={{ height: 340, width: 285, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', mx: 'auto' }}>
      {image && (
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={name}
        />
      )}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>{name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.95rem' }}>{description}</Typography>
        {provider && <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Provider: {provider}</Typography>}
        {location && <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Location: {location}</Typography>}
        {price && <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Price: {price}</Typography>}
        {rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ mr: 0.5, fontSize: '0.9rem' }}>Rating:</Typography>
            <Typography variant="body2" color="secondary" sx={{ fontSize: '0.9rem' }}>{rating} / 5</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

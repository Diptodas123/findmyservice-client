import React from 'react';
import { Box, ImageList, ImageListItem, Skeleton } from '@mui/material';

const PhotosGrid = ({ imageUrls = [], providerName = '', loading, onOpen }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width="33%" height={140} />
        <Skeleton variant="rectangular" width="33%" height={140} />
        <Skeleton variant="rectangular" width="33%" height={140} />
      </Box>
    );
  }

  if (!imageUrls || imageUrls.length === 0) return <Box sx={{ height: 160, bgcolor: 'action.hover', borderRadius: 1 }} />;

  return (
    <ImageList cols={3} gap={8} sx={{ mb: 1 }}>
      {imageUrls.map((src, idx) => (
        <ImageListItem key={`p-${idx}`} sx={{ cursor: 'pointer' }} onClick={() => onOpen(idx)}>
          <img src={src} alt={`${providerName} photo ${idx + 1}`} loading="lazy" style={{ borderRadius: 8 }} />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default PhotosGrid;

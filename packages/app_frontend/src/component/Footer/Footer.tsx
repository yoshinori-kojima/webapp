import type { FC } from 'react';
import React from 'react';
//mui
import { Typography, Container, Box, Link, Divider } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        color :'black',
        py: 1,
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* DividerをContainerの外に配置 */}
      <Divider
        sx={{
          bgcolor: 'grey.400',
          borderBottomWidth: 1,
          width: '100vw', // ビューポート幅に合わせる
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)', // 中央揃え
          mb: 1, // Dividerとコンテンツの間にスペース
        }}
      />

      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          &copy; {new Date().getFullYear()} My Company. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
export default Footer;
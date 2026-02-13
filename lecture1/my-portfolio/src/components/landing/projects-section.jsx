import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * ProjectsSection 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <ProjectsSection />
 */
function ProjectsSection() {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="md">
        <Card
          variant="outlined"
          sx={{
            borderColor: 'divider',
            textAlign: 'center',
            p: { xs: 3, md: 5 },
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '2rem' },
                mb: 2,
              }}
            >
              Projects
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              여기는 Projects 섹션입니다. 대표작 썸네일 3-4개와 &apos;더 보기&apos; 버튼이 들어갈 예정입니다.
            </Typography>
            <Button
              variant="contained"
              component={ Link }
              to="/projects"
              sx={{ px: 4, py: 1 }}
            >
              더 보기
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ProjectsSection;

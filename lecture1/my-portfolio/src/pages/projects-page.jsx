import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import LaunchIcon from '@mui/icons-material/Launch';
import GitHubIcon from '@mui/icons-material/GitHub';
import { supabase } from '../utils/supabase';

/**
 * ProjectsPage 컴포넌트
 * Supabase에서 프로젝트 목록을 가져와 카드 그리드로 표시합니다.
 *
 * Props: 없음
 *
 * Example usage:
 * <ProjectsPage />
 */
function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('프로젝트 로드 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        {/* 헤더 */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
            mb: 1,
            textAlign: 'center',
          }}
        >
          Projects
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, fontSize: { xs: '1rem', md: '1.1rem' } }}
        >
          직접 개발하고 배포한 프로젝트 모음입니다.
        </Typography>

        {/* 로딩 */}
        { loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            프로젝트가 없습니다.
          </Typography>
        ) : (
          /* 프로젝트 카드 목록 (1열 그리드) */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            { projects.map((project) => (
              <Card
                key={project.id}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 4,
                  },
                }}
              >
                {/* 썸네일 (image.thum.io 자동 생성) */}
                <CardMedia
                  component="img"
                  image={project.thumbnail_url}
                  alt={project.title}
                  sx={{
                    width: '100%',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                    bgcolor: 'grey.100',
                  }}
                />

                <CardContent sx={{ px: { xs: 2.5, md: 3 }, pt: 2.5 }}>
                  {/* 제목 */}
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                    { project.title }
                  </Typography>

                  {/* 설명 */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    { project.description }
                  </Typography>

                  {/* 기술 스택 칩 */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    { project.tech_stack?.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem', borderColor: 'primary.light', color: 'primary.main' }}
                      />
                    )) }
                  </Box>
                </CardContent>

                {/* 버튼 */}
                <CardActions sx={{ px: { xs: 2.5, md: 3 }, pb: 2.5, pt: 0, gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<LaunchIcon />}
                    href={project.detail_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ borderRadius: 2 }}
                  >
                    Live Demo
                  </Button>
                  { project.github_url && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<GitHubIcon />}
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ borderRadius: 2 }}
                    >
                      GitHub
                    </Button>
                  ) }
                </CardActions>
              </Card>
            )) }
          </Box>
        ) }
      </Container>
    </Box>
  );
}

export default ProjectsPage;

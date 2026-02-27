import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TopBar from '../components/common/top-bar';
import { supabase } from '../utils/supabase';
import { fetchRandomPhotos } from '../utils/unsplash';
import { useAuth } from '../hooks/use-auth';

/**
 * 게시글 작성 페이지
 * 캡션 입력 + Unsplash 이미지 선택으로 게시글을 작성합니다.
 *
 * Props: 없음
 */
function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleLoadPhotos = async () => {
    setLoadingPhotos(true);
    setSelectedPhoto(null);
    try {
      const data = await fetchRandomPhotos(9, 'pet animal');
      setPhotos(data);
      if (step === 1) setStep(2);
    } catch (err) {
      setError('이미지를 불러오지 못했습니다.');
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleSubmit = async () => {
    if (!caption.trim()) { setError('내용을 입력해 주세요.'); return; }
    if (!selectedPhoto) { setError('이미지를 선택해 주세요.'); return; }

    setSubmitting(true);
    setError('');
    try {
      const { error: insertError } = await supabase.from('sns_posts').insert({
        user_id: user.id,
        caption: caption.trim(),
        image_url: selectedPhoto.urls.regular,
      });
      if (insertError) throw insertError;
      navigate('/');
    } catch (err) {
      setError('게시글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      <TopBar
        title='새 게시글'
        rightAction={
          <Button
            onClick={handleSubmit}
            disabled={submitting || !caption.trim() || !selectedPhoto}
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            { submitting ? '등록 중...' : '게시' }
          </Button>
        }
      />

      <Box sx={{ pt: 9, px: 2 }}>
        { error && <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>{ error }</Alert> }

        {/* Step 1: 캡션 입력 */}
        <Typography variant='subtitle2' sx={{ mb: 1, color: 'text.secondary' }}>
          1단계 · 내용 입력
        </Typography>
        <TextField
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder='반려동물 이야기를 공유해 주세요... 🐾'
          multiline
          rows={4}
          fullWidth
          sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 3 }}
        />

        {/* Step 2: 이미지 선택 */}
        <Typography variant='subtitle2' sx={{ mb: 1, color: 'text.secondary' }}>
          2단계 · 이미지 선택
        </Typography>
        <Button
          variant='outlined'
          startIcon={<RefreshIcon />}
          onClick={handleLoadPhotos}
          disabled={loadingPhotos}
          fullWidth
          sx={{ mb: 2 }}
        >
          { loadingPhotos ? '불러오는 중...' : photos.length > 0 ? '다른 이미지 보기' : '이미지 불러오기' }
        </Button>

        { loadingPhotos && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) }

        { photos.length > 0 && (
          <>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>
              이미지를 탭하여 선택하세요
            </Typography>
            <Grid container spacing={0.5}>
              { photos.map((photo) => (
                <Grid size={{ xs: 4 }} key={photo.id}>
                  <Box
                    onClick={() => setSelectedPhoto(photo)}
                    sx={{
                      position: 'relative',
                      aspectRatio: '1/1',
                      cursor: 'pointer',
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: selectedPhoto?.id === photo.id ? '3px solid' : '3px solid transparent',
                      borderColor: selectedPhoto?.id === photo.id ? 'primary.main' : 'transparent',
                    }}
                  >
                    <Box
                      component='img'
                      src={photo.urls.thumb || photo.urls.regular}
                      alt='선택 이미지'
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    { selectedPhoto?.id === photo.id && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          bgcolor: 'rgba(100, 181, 246, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 36 }} />
                      </Box>
                    ) }
                  </Box>
                </Grid>
              )) }
            </Grid>
          </>
        ) }

        {/* 선택된 이미지 미리보기 */}
        { selectedPhoto && (
          <Box sx={{ mt: 3 }}>
            <Typography variant='subtitle2' sx={{ mb: 1, color: 'text.secondary' }}>
              선택된 이미지
            </Typography>
            <Box
              component='img'
              src={selectedPhoto.urls.regular}
              alt='선택된 이미지'
              sx={{ width: '100%', borderRadius: 2, aspectRatio: '1/1', objectFit: 'cover' }}
            />
          </Box>
        ) }
      </Box>
    </Box>
  );
}

export default CreatePostPage;

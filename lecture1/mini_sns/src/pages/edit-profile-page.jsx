import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TopBar from '../components/common/top-bar';
import { fetchRandomPhotos } from '../utils/unsplash';
import { useAuth } from '../hooks/use-auth';

/**
 * 프로필 수정 페이지
 * 아바타(Unsplash), 표시 이름, 소개글을 수정합니다.
 *
 * Props: 없음
 */
function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPhotos, setAvatarPhotos] = useState([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleLoadAvatars = async () => {
    setLoadingAvatars(true);
    setSelectedAvatar(null);
    try {
      const data = await fetchRandomPhotos(6, 'pet portrait');
      setAvatarPhotos(data);
    } catch (err) {
      setError('이미지를 불러오지 못했습니다.');
    } finally {
      setLoadingAvatars(false);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) { setError('이름을 입력해 주세요.'); return; }
    setSaving(true);
    setError('');
    try {
      const updates = {
        display_name: displayName.trim(),
        bio: bio.trim(),
      };
      if (selectedAvatar) {
        updates.avatar_url = selectedAvatar.urls.regular;
      }
      await updateProfile(updates);
      navigate('/profile');
    } catch (err) {
      setError('프로필 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const currentAvatar = selectedAvatar?.urls.regular || profile?.avatar_url || '';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      <TopBar
        title='프로필 수정'
        rightAction={
          <Button
            onClick={handleSave}
            disabled={saving || !displayName.trim()}
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            { saving ? '저장 중...' : '완료' }
          </Button>
        }
        onBack={() => navigate('/profile')}
      />

      <Box sx={{ pt: 9, px: 2 }}>
        { error && <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>{ error }</Alert> }

        {/* 현재 아바타 */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            src={currentAvatar}
            sx={{ width: 90, height: 90, mx: 'auto', bgcolor: 'primary.light', fontSize: '2.5rem', mb: 1 }}
          >
            { displayName[0] || profile?.display_name?.[0] || '?' }
          </Avatar>

          <Button
            variant='outlined'
            size='small'
            startIcon={<RefreshIcon />}
            onClick={handleLoadAvatars}
            disabled={loadingAvatars}
          >
            { loadingAvatars ? '불러오는 중...' : '프로필 사진 변경' }
          </Button>
        </Box>

        {/* 아바타 사진 선택 */}
        { loadingAvatars && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={32} />
          </Box>
        ) }

        { avatarPhotos.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>
              프로필 사진 선택
            </Typography>
            <Grid container spacing={0.5}>
              { avatarPhotos.map((photo) => (
                <Grid size={{ xs: 4 }} key={photo.id}>
                  <Box
                    onClick={() => setSelectedAvatar(photo)}
                    sx={{
                      position: 'relative',
                      aspectRatio: '1/1',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: selectedAvatar?.id === photo.id ? '3px solid' : '3px solid transparent',
                      borderColor: selectedAvatar?.id === photo.id ? 'primary.main' : 'transparent',
                      mx: 'auto',
                      width: 80,
                      height: 80,
                    }}
                  >
                    <Box
                      component='img'
                      src={photo.urls.thumb || photo.urls.regular}
                      alt='아바타 선택'
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    { selectedAvatar?.id === photo.id && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          bgcolor: 'rgba(100, 181, 246, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircleIcon sx={{ color: 'white', fontSize: 28 }} />
                      </Box>
                    ) }
                  </Box>
                </Grid>
              )) }
            </Grid>
          </Box>
        ) }

        {/* 이름 수정 */}
        <TextField
          label='표시 이름'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2, bgcolor: 'background.paper' }}
        />

        {/* 소개글 수정 */}
        <TextField
          label='소개글'
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder='자신을 소개해 주세요...'
          sx={{ mb: 3, bgcolor: 'background.paper' }}
        />

        {/* 취소 버튼 */}
        <Button
          variant='text'
          fullWidth
          onClick={() => navigate('/profile')}
          sx={{ color: 'text.secondary' }}
        >
          취소
        </Button>
      </Box>
    </Box>
  );
}

export default EditProfilePage;

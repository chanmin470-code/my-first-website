import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../../utils/supabase';

/** 선택 가능한 이모지 목록 */
const EMOJI_LIST = ['😊', '👋', '🎉', '💡', '🔥', '✨', '💻', '🚀', '🎨', '👍'];

/** SNS 링크 정보 */
const SNS_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/chanmin470-code',
    icon: <GitHubIcon />,
    color: '#1D1D1F',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: <LinkedInIcon />,
    color: '#0A66C2',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: <InstagramIcon />,
    color: '#E1306C',
  },
];

/**
 * GuestbookForm 컴포넌트
 * 방명록 작성 폼
 *
 * Props:
 * @param {function} onSubmitted - 작성 완료 후 목록 새로고침 콜백 [Required]
 *
 * Example usage:
 * <GuestbookForm onSubmitted={fetchEntries} />
 */
function GuestbookForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: '',
    content: '',
    emoji: '😊',
    email: '',
    sns: '',
    job: '',
    region: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleEmoji = (emoji) => {
    setForm((prev) => ({ ...prev, emoji }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('guestbook').insert({
        name: form.name.trim(),
        content: form.content.trim(),
        emoji: form.emoji,
        email: form.email.trim() || null,
        sns: form.sns.trim() || null,
        job: form.job.trim() || null,
        region: form.region.trim() || null,
      });
      if (error) throw error;

      setForm({ name: '', content: '', emoji: '😊', email: '', sns: '', job: '', region: '' });
      setIsSuccess(true);
      onSubmitted();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch {
      /* empty */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={ handleSubmit }
      sx={ {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E8ED',
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        mb: 4,
      } }
    >
      <Typography variant='h6' sx={ { fontWeight: 600, color: '#1D1D1F', mb: 2.5 } }>
        방명록 남기기
      </Typography>

      {/* 이모지 선택 */}
      <Box sx={ { mb: 2.5 } }>
        <Typography variant='body2' sx={ { color: '#6E6E73', mb: 1 } }>
          이모지 선택
        </Typography>
        <Box sx={ { display: 'flex', gap: 1, flexWrap: 'wrap' } }>
          {EMOJI_LIST.map((emoji) => (
            <Box
              key={ emoji }
              onClick={ () => handleEmoji(emoji) }
              sx={ {
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                borderRadius: 2,
                cursor: 'pointer',
                border: '2px solid',
                borderColor: form.emoji === emoji ? '#0071E3' : '#E8E8ED',
                backgroundColor: form.emoji === emoji ? '#EBF4FF' : 'transparent',
                transition: 'all 0.15s',
                '&:hover': { borderColor: '#0071E3' },
              } }
            >
              {emoji}
            </Box>
          ))}
        </Box>
      </Box>

      {/* 필수 정보 */}
      <Box sx={ { display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } } }>
        <TextField
          label='이름 *'
          value={ form.name }
          onChange={ handleChange('name') }
          required
          fullWidth
          size='small'
          sx={ { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }
        />
      </Box>

      {/* 선택 정보 */}
      <Typography variant='caption' sx={ { color: '#86868B', display: 'block', mb: 1.5 } }>
        선택 정보 (입력하지 않아도 됩니다)
      </Typography>
      <Box sx={ { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2.5 } }>
        <TextField
          label='이메일 (비공개 저장)'
          value={ form.email }
          onChange={ handleChange('email') }
          size='small'
          type='email'
          sx={ { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }
        />
        <TextField
          label='SNS 계정'
          value={ form.sns }
          onChange={ handleChange('sns') }
          size='small'
          placeholder='@인스타그램 등'
          sx={ { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }
        />
        <TextField
          label='소속 / 직업'
          value={ form.job }
          onChange={ handleChange('job') }
          size='small'
          placeholder='회사, 학교 등'
          sx={ { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }
        />
        <TextField
          label='거주 지역'
          value={ form.region }
          onChange={ handleChange('region') }
          size='small'
          placeholder='서울, 경기 등'
          sx={ { '& .MuiOutlinedInput-root': { borderRadius: 2 } } }
        />
      </Box>

      {/* 메시지 - 제일 아래 큰 입력란 */}
      <TextField
        label='메시지 *'
        value={ form.content }
        onChange={ handleChange('content') }
        required
        fullWidth
        multiline
        rows={ 6 }
        sx={ { mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } } }
      />

      <Button
        type='submit'
        variant='contained'
        endIcon={ isSubmitting ? <CircularProgress size={ 16 } color='inherit' /> : <SendIcon /> }
        disabled={ isSubmitting || !form.name.trim() || !form.content.trim() }
        sx={ {
          backgroundColor: '#0071E3',
          borderRadius: 2,
          px: 3,
          '&:hover': { backgroundColor: '#0077ED' },
        } }
      >
        {isSuccess ? '등록 완료! 🎉' : isSubmitting ? '등록 중...' : '방명록 등록'}
      </Button>
    </Box>
  );
}

/**
 * GuestbookList 컴포넌트
 * 방명록 항목 목록 표시
 *
 * Props:
 * @param {Array} entries - 방명록 항목 배열 [Required]
 * @param {boolean} isLoading - 로딩 상태 [Required]
 *
 * Example usage:
 * <GuestbookList entries={entries} isLoading={isLoading} />
 */
function GuestbookList({ entries, isLoading }) {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  if (isLoading) {
    return (
      <Box sx={ { display: 'flex', justifyContent: 'center', py: 4 } }>
        <CircularProgress size={ 28 } sx={ { color: '#0071E3' } } />
      </Box>
    );
  }

  if (entries.length === 0) {
    return (
      <Box sx={ { textAlign: 'center', py: 4 } }>
        <Typography variant='body2' sx={ { color: '#86868B' } }>
          첫 번째 방명록을 남겨보세요! 👋
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
      {entries.map((entry) => (
        <Box
          key={ entry.id }
          sx={ {
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E8ED',
            borderRadius: 3,
            p: 3,
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
          } }
        >
          <Box sx={ { display: 'flex', alignItems: 'flex-start', gap: 1.5 } }>
            {/* 이모지 아바타 */}
            <Box
              sx={ {
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#F5F5F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0,
              } }
            >
              {entry.emoji}
            </Box>

            <Box sx={ { flex: 1, minWidth: 0 } }>
              {/* 이름 + 날짜 */}
              <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 } }>
                <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                  <Typography variant='body1' sx={ { fontWeight: 600, color: '#1D1D1F' } }>
                    {entry.name}
                  </Typography>
                  {(entry.job || entry.region) && (
                    <Typography variant='caption' sx={ { color: '#86868B' } }>
                      {[entry.job, entry.region].filter(Boolean).join(' · ')}
                    </Typography>
                  )}
                </Box>
                <Typography variant='caption' sx={ { color: '#86868B', flexShrink: 0 } }>
                  {formatDate(entry.created_at)}
                </Typography>
              </Box>

              {/* 메시지 */}
              <Typography variant='body2' sx={ { color: '#1D1D1F', lineHeight: 1.6, whiteSpace: 'pre-wrap' } }>
                {entry.content}
              </Typography>

              {/* SNS */}
              {entry.sns && (
                <Typography variant='caption' sx={ { color: '#6E6E73', mt: 0.5, display: 'block' } }>
                  {entry.sns}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/**
 * ContactSection 컴포넌트
 * 연락처(상단) + 방명록(하단) 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <ContactSection />
 */
function ContactSection() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });
      setEntries(data || []);
    } catch {
      /* empty */
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      id='contact'
      sx={ {
        backgroundColor: '#F5F5F7',
        py: { xs: 8, md: 12 },
      } }
    >
      <Container maxWidth='md'>
        {/* 섹션 제목 */}
        <Box sx={ { textAlign: 'center', mb: 6 } }>
          <Typography
            variant='h2'
            sx={ {
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: '#1D1D1F',
              mb: 1.5,
            } }
          >
            Contact
          </Typography>
          <Typography variant='body1' sx={ { color: '#6E6E73' } }>
            편하게 연락주세요 😊
          </Typography>
        </Box>

        {/* 연락처 영역 */}
        <Box
          sx={ {
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E8ED',
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            mb: 6,
          } }
        >
          {/* 이메일 */}
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 } }>
            <Box
              sx={ {
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#EBF4FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              } }
            >
              <EmailIcon sx={ { color: '#0071E3', fontSize: 22 } } />
            </Box>
            <Box>
              <Typography variant='caption' sx={ { color: '#86868B', display: 'block' } }>
                이메일
              </Typography>
              <Typography
                variant='body1'
                component='a'
                href='mailto:chanmin470@gmail.com'
                sx={ {
                  color: '#0071E3',
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                } }
              >
                chanmin470@gmail.com
              </Typography>
            </Box>
          </Box>

          <Divider sx={ { mb: 3 } } />

          {/* SNS 아이콘 버튼 */}
          <Box>
            <Typography variant='caption' sx={ { color: '#86868B', display: 'block', mb: 1.5 } }>
              SNS
            </Typography>
            <Box sx={ { display: 'flex', gap: 1.5 } }>
              {SNS_LINKS.map((sns) => (
                <Tooltip key={ sns.label } title={ sns.label } placement='top'>
                  <IconButton
                    component='a'
                    href={ sns.href }
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={ {
                      width: 48,
                      height: 48,
                      backgroundColor: '#F5F5F7',
                      color: sns.color,
                      border: '1px solid #E8E8ED',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: sns.color,
                        color: '#FFFFFF',
                        borderColor: sns.color,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${sns.color}40`,
                      },
                    } }
                  >
                    {sns.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>

        {/* 방명록 */}
        <Box>
          <Typography
            variant='h5'
            sx={ {
              fontWeight: 700,
              color: '#1D1D1F',
              mb: 3,
            } }
          >
            방명록
          </Typography>

          {/* 방명록 폼 */}
          <GuestbookForm onSubmitted={ fetchEntries } />

          {/* 방명록 목록 */}
          <GuestbookList entries={ entries } isLoading={ isLoading } />
        </Box>
      </Container>
    </Box>
  );
}

export default ContactSection;

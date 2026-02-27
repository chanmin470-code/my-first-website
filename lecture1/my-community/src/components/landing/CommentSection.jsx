import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../hooks/useAuth';

/**
 * CommentItem 컴포넌트
 * 단일 댓글 (대댓글 포함)
 *
 * Props:
 * @param {object} comment - 댓글 데이터 [Required]
 * @param {Array} allComments - 전체 댓글 목록 [Required]
 * @param {number} postId - 게시물 ID [Required]
 * @param {function} onRefresh - 댓글 새로고침 콜백 [Required]
 * @param {number} depth - 중첩 깊이 [Optional, 기본값: 0]
 */
function CommentItem({ comment, allComments, postId, onRefresh, depth = 0 }) {
  const { currentUser } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const replies = allComments.filter((c) => c.parent_id === comment.id);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !currentUser) return;
    setIsSubmitting(true);
    try {
      await supabase.from('comments').insert({
        content: replyText.trim(),
        user_id: currentUser.id,
        post_id: postId,
        parent_id: comment.id,
      });
      setReplyText('');
      setIsReplying(false);
      onRefresh();
    } catch {
      /* empty */
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    await supabase.from('comments').delete().eq('id', comment.id);
    onRefresh();
  };

  return (
    <Box sx={ { ml: depth > 0 ? { xs: 2, md: 4 } : 0 } }>
      <Box
        sx={ {
          p: 2,
          borderRadius: 2,
          backgroundColor: depth > 0 ? 'rgba(0, 180, 255, 0.04)' : 'transparent',
          border: depth > 0 ? '1px solid rgba(0, 180, 255, 0.1)' : 'none',
          mb: 1,
        } }
      >
        {/* 댓글 헤더 */}
        <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 } }>
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
            {depth > 0 && (
              <ReplyIcon sx={ { fontSize: 14, color: 'primary.main', transform: 'scaleX(-1)' } } />
            )}
            <Typography variant='caption' sx={ { fontWeight: 700, color: 'primary.light' } }>
              {comment.users?.name || '알 수 없음'}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {formatDate(comment.created_at)}
            </Typography>
          </Box>
          <Box sx={ { display: 'flex', gap: 1 } }>
            {currentUser && depth === 0 && (
              <Button
                size='small'
                variant='text'
                onClick={ () => setIsReplying(!isReplying) }
                sx={ { fontSize: '0.7rem', minWidth: 0, px: 1 } }
              >
                답글
              </Button>
            )}
            {currentUser?.id === comment.user_id && (
              <Button
                size='small'
                variant='text'
                color='error'
                onClick={ handleDelete }
                sx={ { fontSize: '0.7rem', minWidth: 0, px: 1 } }
              >
                <DeleteIcon sx={ { fontSize: 14 } } />
              </Button>
            )}
          </Box>
        </Box>

        {/* 댓글 내용 */}
        <Typography variant='body2' sx={ { whiteSpace: 'pre-wrap', lineHeight: 1.6 } }>
          {comment.content}
        </Typography>

        {/* 대댓글 입력 */}
        {isReplying && (
          <Box sx={ { mt: 1.5, display: 'flex', gap: 1 } }>
            <TextField
              size='small'
              placeholder='답글을 입력하세요...'
              value={ replyText }
              onChange={ (e) => setReplyText(e.target.value) }
              fullWidth
              multiline
              maxRows={ 3 }
            />
            <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5 } }>
              <Button
                size='small'
                variant='contained'
                onClick={ handleReplySubmit }
                disabled={ isSubmitting || !replyText.trim() }
              >
                등록
              </Button>
              <Button
                size='small'
                variant='text'
                color='inherit'
                onClick={ () => setIsReplying(false) }
              >
                취소
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* 대댓글 목록 */}
      {replies.map((reply) => (
        <CommentItem
          key={ reply.id }
          comment={ reply }
          allComments={ allComments }
          postId={ postId }
          onRefresh={ onRefresh }
          depth={ depth + 1 }
        />
      ))}
    </Box>
  );
}

/**
 * CommentSection 컴포넌트
 * 게시물 상세 페이지의 댓글/대댓글 영역
 *
 * Props:
 * @param {Array} comments - 전체 댓글 목록 [Required]
 * @param {number} postId - 게시물 ID [Required]
 * @param {function} onRefresh - 새로고침 콜백 [Required]
 *
 * Example usage:
 * <CommentSection comments={comments} postId={post.id} onRefresh={fetchComments} />
 */
function CommentSection({ comments, postId, onRefresh }) {
  const { currentUser } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rootComments = comments.filter((c) => c.parent_id === null);

  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUser) return;
    setIsSubmitting(true);
    try {
      await supabase.from('comments').insert({
        content: newComment.trim(),
        user_id: currentUser.id,
        post_id: postId,
        parent_id: null,
      });
      setNewComment('');
      onRefresh();
    } catch {
      /* empty */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={ { mt: 4 } }>
      <Typography variant='h6' sx={ { fontWeight: 700, mb: 2 } }>
        댓글 {comments.length}개
      </Typography>

      {/* 댓글 작성 */}
      {currentUser ? (
        <Box sx={ { mb: 3, display: 'flex', gap: 1.5 } }>
          <TextField
            placeholder='댓글을 입력하세요...'
            value={ newComment }
            onChange={ (e) => setNewComment(e.target.value) }
            fullWidth
            multiline
            rows={ 2 }
            size='small'
          />
          <Button
            variant='contained'
            onClick={ handleSubmit }
            disabled={ isSubmitting || !newComment.trim() }
            sx={ { alignSelf: 'flex-end', minWidth: 72 } }
          >
            등록
          </Button>
        </Box>
      ) : (
        <Box sx={ { mb: 3, p: 2, borderRadius: 2, border: '1px dashed rgba(0, 180, 255, 0.2)', textAlign: 'center' } }>
          <Typography variant='body2' color='text.secondary'>
            댓글을 작성하려면 로그인이 필요합니다.
          </Typography>
        </Box>
      )}

      <Divider sx={ { mb: 2 } } />

      {/* 댓글 목록 */}
      {rootComments.length === 0 ? (
        <Typography color='text.secondary' variant='body2' sx={ { py: 2 } }>
          첫 번째 댓글을 작성해보세요!
        </Typography>
      ) : (
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1.5 } }>
          {rootComments.map((comment) => (
            <Box key={ comment.id }>
              <CommentItem
                comment={ comment }
                allComments={ comments }
                postId={ postId }
                onRefresh={ onRefresh }
              />
              <Divider sx={ { mt: 1 } } />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CommentSection;

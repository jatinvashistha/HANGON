import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { message, Button } from 'antd';


const Example = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState(null);

  const handleLiked = async () => {
    try {
      setLoading(true);
      setLiked(!liked);
      // await dispatch(likeAndUnlikePosts(postId));
      // dispatch(getFollowingPosts());
      setMessageText('Post liked successfully!');
    } catch (error) {
      console.error('Error liking post:', error);
      setMessageText('Failed to like the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onCloseMessage = () => {
    setMessageText(null);
  };

  return (
    <div>
      {messageText && (
        <div>
          <p>{messageText}</p>
          <Button onClick={onCloseMessage}>Close</Button>
        </div>
      )}

      <Button onClick={handleLiked} loading={loading}>
        {liked ? 'Unlike' : 'Like'}
      </Button>
    </div>
  );
};

export default Example;
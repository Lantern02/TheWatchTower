import React from 'react';
import { useParams } from 'react-router-dom';
import MediumEditor from './MediumEditor';

const EditPostEditor = () => {
  const { postId } = useParams<{ postId: string }>();

  return <MediumEditor postId={postId} sectionId="" />;
};

export default EditPostEditor;
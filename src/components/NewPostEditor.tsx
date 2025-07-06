import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MediumEditor from './MediumEditor';

const NewPostEditor = () => {
  const [searchParams] = useSearchParams();
  const sectionId = searchParams.get('section') || '';

  return <MediumEditor sectionId={sectionId} />;
};

export default NewPostEditor;
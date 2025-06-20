
import React from 'react';
import DraftManager from '@/components/DraftManager';

const Drafts = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <DraftManager />
      </div>
    </div>
  );
};

export default Drafts;

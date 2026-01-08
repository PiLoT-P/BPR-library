import React from 'react';
import { Button } from 'bpr-library';

export default function App() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Playground for BPR Library</h1>
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary" style={{ marginLeft: 10 }}>
        Secondary Button
      </Button>
    </div>
  );
}
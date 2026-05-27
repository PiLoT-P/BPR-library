import { Button, Icon, Autocomplete, ModalBox } from 'bpr-library';
import { useState } from 'react';

export default function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false); 

  return (
    <div style={{ padding: 40 }}>
      <h1>Playground for BPR Library</h1>
      <Button 
        variant="primary" 
        style={{ marginBottom: 10 }}
        onClick={() => {setIsOpen(true)}}
      >
        Primary Button
      </Button>
      <Button variant="secondary">
        Secondary Button
      </Button>
      <Icon
        name='trash'
      />
      <Autocomplete
        value={null}
        onChange={() => {}}
        handleSearch={() => {}}
        options={[]}
      />
      <ModalBox
        isOpen={isOpen}
        handleClose={() => {setIsOpen(false)}}
        type='center'
      >
        <div>test modal</div>
      </ModalBox>
    </div>
  );
}
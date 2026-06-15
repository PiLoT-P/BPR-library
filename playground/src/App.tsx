import { Button, Icon, Autocomplete, ModalBox, PopUp } from 'bpr-library';
import { useRef, useState } from 'react';

export default function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false); 
  const [isOpenSecond, setIsOpenSecond] = useState<boolean>(false); 

  const testRef = useRef<HTMLDivElement>(null);
  const test2Ref = useRef<HTMLDivElement>(null);

  return (
    <div style={{ padding: 40 }}
    >
      <h1>Playground for BPR Library</h1>
      <div
        ref={testRef}
      >
        <Button 
          variant="primary" 
          style={{ marginBottom: 10 }}
          onClick={() => {setIsOpen(true)}}
        >
          Primary Button
        </Button>
      </div>
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

      {isOpen &&
        <PopUp
          containerRef={testRef}
          handleClose={() => {setIsOpen(false)}}
        >
          <div
            ref={test2Ref}
          >
            <Button onClick={() => setIsOpenSecond(true)}>Children popup</Button>

            {isOpenSecond &&
              <PopUp
                containerRef={test2Ref}
                handleClose={() => {setIsOpenSecond(false)}}
              >
                <div>
                  <h5>TEST CHILD POPUP</h5>
                </div>
              </PopUp>
            }
          </div>
        </PopUp>
      }
    </div>
  );
}
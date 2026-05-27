import { useRef, useState, KeyboardEvent, useEffect, useMemo, useCallback, FC } from 'react'
import s from './Autocomplete.module.scss'
import { Loader } from '../loader';
import { Icon } from '../icon-display';
import { PopUp } from '../popup';


export interface AutocompleteOption {
  id: string | number
  name?: string;
  title?: string;
  content?: string;
}

type SingleAutocompleteProps<ST> = {
  multiple?: false;
  value: ST | null;
  onChange: (v: ST | null) => void;
};

type MultiAutocompleteProps<ST> = {
  multiple: true;
  value: ST[] | null;
  onChange: (v: ST[] | null) => void;
};

interface CommonAutocompleteProps<ST>{
  options: ST[]
  handleSearch: (v: string) => void;
  placeholder?: string
  size?: 'small' | 'medium'
  disabled?: boolean
  error?: boolean
  fullWidth?: boolean
  isLoading?: boolean
  customMenuItemRenderer?: (option: ST, isSelected: boolean) => React.ReactNode
  className?: string
}

export type AutocompleteProps<ST extends AutocompleteOption> = CommonAutocompleteProps<ST> &
  (SingleAutocompleteProps<ST> | MultiAutocompleteProps<ST>);

  // <ST extends AutocompleteOption>

export const Autocomplete = <ST extends AutocompleteOption>({
  options,
  value,
  onChange,
  placeholder = 'Не вибрано...',
  size = 'medium',
  multiple = false,
  disabled = false,
  error = false,
  // freeSolo = false,
  fullWidth = false,
  customMenuItemRenderer,
  isLoading,
  className = '',
  handleSearch
}: AutocompleteProps<ST>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [inputValue, setInputValue] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const listRef = useRef<HTMLUListElement | null>(null);
  const optionRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const selectedValues = useMemo(() => (multiple ? (value as ST[] || []) : (value ? [value as ST] : [])), [value, multiple]);

  const handleOptionRender = (option: ST) => option.title || option.content || option.name || '';

  const filteredOptions = useMemo(() => options.filter(option => (
    handleOptionRender(option).toLowerCase().includes(inputValue.toLowerCase())
  )), [options, inputValue]);

  const setOptionRef = useCallback((id: AutocompleteOption['id'], el: HTMLLIElement | null) => {
    optionRefs.current[id] = el;
  }, []);

  /* Прокрут до вибраного значення в select */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const firstSelectedId = selectedValues[0]?.id;
        const selectedElement = optionRefs.current[firstSelectedId];

        if (selectedElement && listRef.current) {
          listRef.current.scrollTo({
            top: selectedElement.offsetTop - listRef.current.offsetTop,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    handleSearch(newValue);
    setHighlightedIndex(-1)
    if (!isOpen) setIsOpen(true)
  }

  const handleOptionSelect = (option: ST) => {
    if (multiple) {
      const newValue = [...selectedValues, option];
      (onChange as (v: ST[] | null) => void)(newValue);
    } else {
      setIsOpen(false);
      (onChange as (v: ST | null) => void)(option);
    }
    setInputValue('');
  }

  const handleRemoveOption = (optionToRemove: ST, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (multiple) {
      const newValue = selectedValues.filter(
        (option) => option.id !== optionToRemove.id
      );
      (onChange as (v: ST[] | null) => void)(
        newValue.length ? newValue : null
      );
    } else {
      (onChange as (v: ST | null) => void)(null);
    }
  }

  const handleKeyDown = (eDown: KeyboardEvent<HTMLInputElement>) => {
    switch (eDown.key) {
    case 'ArrowDown':
      eDown.preventDefault()
      setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev))
      break
    case 'ArrowUp':
      eDown.preventDefault()
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev))
      break
    case 'Enter':
      eDown.preventDefault()
      if (
        highlightedIndex >= 0 &&
          filteredOptions[highlightedIndex] &&
          !selectedValues.some((e) => e.id === highlightedIndex)
      ) {
        handleOptionSelect(filteredOptions[highlightedIndex])
      }
      break
    case 'Escape':
      setIsOpen(false)
      break
    case 'Backspace':
      if (!inputValue && selectedValues.length > 0) {
        handleRemoveOption(selectedValues[selectedValues.length - 1])
      }
      break
    default:
      return null;
    }
  }

  return (
    <div
      ref={containerRef}
      className={`${s.container} ${s[size]} ${className} ${error ? s.error : ''}`}
      onClick={() => !disabled && inputRef.current?.focus()}
      style={{
        width: fullWidth ? '100%' : 'min-content',
      }}
    >
      {isLoading && <Loader />}
      <div className={s.select_container}>
        {selectedValues.length > 0 && (
          <ul className={s.selected_list}>
            {selectedValues.map((option) => (
              <li
                key={option.id}
                className={s.selected_item}
              >
                {handleOptionRender(option)}
                {!disabled && (
                  <button
                    type="button"
                    className={s.unselect_btn}
                    onClick={(e) => handleRemoveOption(option, e)}
                  >
                    <Icon
                      name='cancel'
                      width={12}
                      height={12}
                      className={s.cancel_icon}
                    />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedValues.length === 0 ? placeholder : ''}
          disabled={disabled}
          className={s.input}
        />

        {!disabled && (
          <button
            type="button"
            className={s.toggle_button}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Icon
              name={`arrow-${isOpen ? 'up' : 'down'}`}
              width={12}
              height={12}
              className={s.icon_arrow}
            />
          </button>
        )}
      </div>

      {(isOpen && !disabled) && (
        <PopUp
          containerRef={containerRef}
          handleClose={() => {
            setIsOpen(false);
          }}
        >
          <ul className={s.menu_list} ref={listRef}>
            {filteredOptions.length === 0 ? (
              <li className={s.no_options}>No options</li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = selectedValues.some((e) => e.id === option.id);

                return (
                  <li
                    key={option.id}
                    ref={(el) => setOptionRef(option.id, el)}
                    className={`
                      ${s.menu_item}
                      ${index === highlightedIndex ? s.highlighted : ''}
                      ${isSelected ? s.highlighted : ''}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSelected) {
                        handleRemoveOption(option)
                      } else {
                        handleOptionSelect(option)
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {customMenuItemRenderer ?
                      customMenuItemRenderer(option, isSelected)
                      :
                      handleOptionRender(option)}
                  </li>
                )
              })
            )}
          </ul>
        </PopUp>
      )}
    </div>
  )
}
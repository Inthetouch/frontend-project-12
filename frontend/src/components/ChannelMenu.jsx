import { useRef, useEffect, useState } from 'react';

function ChannelMenu({ channel, onRename, onDelete, isLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isDefault = channel?.name?.toLowerCase() === 'general';

  const handleRename = () => {
    onRename();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div className="channel-menu" ref={menuRef}>
      <button
        className="channel-menu__toggle"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        aria-label="Меню канала"
        aria-expanded={isOpen}
      >
        ⋮
      </button>

      {isOpen && (
        <div className="channel-menu__dropdown">
          <button
            className="channel-menu__item"
            onClick={handleRename}
            disabled={isLoading}
          >
            ✎ Переименовать
          </button>

          {!isDefault && (
            <button
              className="channel-menu__item channel-menu__item--danger"
              onClick={handleDelete}
              disabled={isLoading}
            >
              ✕ Удалить
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ChannelMenu;
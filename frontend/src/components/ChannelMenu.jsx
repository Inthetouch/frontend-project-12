import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DEFAULT_CHANNELS = ['general', 'random'];

function ChannelMenu({ channel, onRename, onDelete, isLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
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

  if (!channel) {
    return null;
  }

  const isDefaultChannel = DEFAULT_CHANNELS.includes(channel.name?.toLowerCase());

  const handleRename = () => {
    onRename();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  if (isDefaultChannel) {
    return null;
  }

  return (
    <div className="channel-menu" ref={menuRef}>
      <button
        className="channel-menu__toggle"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        aria-label={t('chat.menu.rename')}
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
            {t('chat.menu.rename')}
          </button>

          <button
            className="channel-menu__item channel-menu__item--danger"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {t('chat.channelModal.delete.menu')}
          </button>
        </div>
      )}
    </div>
  );
}

export default ChannelMenu;
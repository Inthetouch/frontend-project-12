import { useTranslation } from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import { setCurrentChannel } from '../store/chatSlice';
import ChannelMenu from './ChannelMenu';

function ChannelList({ onAddChannel, onRenameChannel, onDeleteChannel }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { channels, currentChannelId, isLoadingChannels } = useSelector((state) => state.chat);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  return (
    <aside className="channel-list">
      <div className="channel-list__header">
        <h2 className="channel-list__title">{t('chat.channels.title')}</h2>
        <button
          className="channel-list__add-btn"
          onClick={onAddChannel}
          title={t('chat.channels.addChannel')}
          disabled={isLoadingChannels}
        >
          +
        </button>
      </div>

      <ul className="channel-list__items">
        {channels.map((channel) => (
          <li key={channel.id} className="channel-list__item">
            <button
              className={`channel-list__button ${
                currentChannelId === channel.id ? 'active' : ''
              }`}
              onClick={() => handleChannelClick(channel.id)}
              disabled={isLoadingChannels}
            >
              <span className="channel-list__name">
                # {channel.name}
              </span>
            </button>

            <ChannelMenu
              channel={channel}
              isLoading={isLoadingChannels}
              onRename={() => onRenameChannel(channel)}
              onDelete={() => onDeleteChannel(channel)}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default ChannelList;
import {useDispatch, useSelector} from 'react-redux';
import { setCurrentChannel } from '../store/chatSlice';

function ChannelList() {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.chat);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  return (
    <aside className='channel-list'>
      <h2 className='channel-list__title'>Каналы</h2>
      <ul className='channel-list__items'>
        {channels.map((channel) => (
          <li key={channel.id}>
            <button
              className={`channel-list__button ${currentChannelId === channel.id ? 'active' : ''}`}
              onClick={() => handleChannelClick(channel.id)}
            >
              {channel.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default ChannelList;
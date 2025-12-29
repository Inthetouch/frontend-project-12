import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentChannel } from '../store/chatSlice'
import { Nav, Button, Dropdown, ButtonGroup } from 'react-bootstrap'

function ChannelList({ onAddChannel, onRenameChannel, onDeleteChannel }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { channels, currentChannelId } = useSelector(state => state.chat)

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId))
  }

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('chat.channels.title')}</b>
        <Button
          variant="group-vertical"
          className="p-0 text-primary btn-none border-0 bg-transparent"
          onClick={onAddChannel}
          title={t('chat.channels.addChannel')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>

      <Nav variant="pills" className="flex-column px-2 mb-3 overflow-auto h-100 d-block" as="ul">
        {channels.map(channel => (
          <Nav.Item key={channel.id} as="li" className="w-100">
            {channel.removable
              ? (
                  <Dropdown as={ButtonGroup} className="d-flex w-100">
                    <Button
                      variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                      className="w-100 text-start text-truncate rounded-0 rounded-start"
                      onClick={() => handleChannelClick(channel.id)}
                    >
                      <span className="me-1">#</span>
                      {' '}
                      {channel.name}
                    </Button>

                    <Dropdown.Toggle
                      split
                      variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                      className="flex-grow-0 border-start-0"
                    >
                      <span className="visually-hidden">{t('chat.channels.manage')}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => onRenameChannel(channel)}>
                        {t('chat.menu.rename')}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => onDeleteChannel(channel)}>
                        {t('chat.channelModal.delete.menu')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )
              : (
                  <Button
                    variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                    className="w-100 text-start rounded-0 rounded-start mb-1"
                    onClick={() => handleChannelClick(channel.id)}
                  >
                    <span className="me-1">#</span>
                    {' '}
                    {channel.name}
                  </Button>
                )}
          </Nav.Item>
        ))}
      </Nav>
    </>
  )
}

export default ChannelList

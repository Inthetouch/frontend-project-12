import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  initializeChat,
  addMessageFromSocket,
  setSocketConnected,
  setError,
  addChannelFromSocket,
  updateChannelFromSocket,
  removeChannelFromSocket,
} from '../store/chatSlice'
import { logout } from '../services/authService'
import {
  initializeSocket,
  disconnectSocket,
  onNewMessage,
  offNewMessage,
  onError,
  offError,
  onNewChannel,
  offNewChannel,
  onRenameChannel,
  offRenameChannel,
  onRemoveChannel,
  offRemoveChannel,
} from '../services/socketService'
import { showErrorToast, showInfoToast } from '../utils/toastService'
import { logError, logWarning, logInfo } from '../utils/errorLogger'
import Header from '../components/Header'
import ChannelList from '../components/ChannelList'
import MessageList from '../components/MessageList'
import MessageForm from '../components/MessageForm'
import AddChannelModal from '../components/AddChannelModal'
import RenameChannelModal from '../components/RenameChannelModal'
import DeleteChannelModal from '../components/DeleteChannelModal'
import { Container, Row, Col, Spinner } from 'react-bootstrap'

const MainPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { loading, socketConnected, channels, currentChannelId, messages } = useSelector(state => state.chat)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const wasConnected = useRef(false)

  const currentChannel = channels.find(c => c.id === currentChannelId)
  const currentMessagesCount = messages[currentChannelId]?.length || 0

  const handlersRef = useRef({
    handleNewMessage: null,
    handleError: null,
    handleNewChannel: null,
    handleRenameChannel: null,
    handleRemoveChannel: null,
  })

  useEffect(() => {
    logInfo('MainPage mounted')
    dispatch(initializeChat())
  }, [dispatch])

  useEffect(() => {
    if (socketConnected && !wasConnected.current) {
      wasConnected.current = true
    }
    else if (socketConnected && wasConnected.current) {
      showInfoToast('toast.network.online')
      logInfo('WebSocket connected')
    }
    else if (!socketConnected && wasConnected.current) {
      showErrorToast('toast.network.offline')
      logWarning('WebSocket connection lost', { wasConnected })
    }
  }, [socketConnected])

  useEffect(() => {
    const handlers = handlersRef.current

    const setupSocket = async () => {
      try {
        await initializeSocket()
        dispatch(setSocketConnected(true))
        logInfo('WebSocket initialized')

        const handleNewMessage = (message) => {
          dispatch(addMessageFromSocket({ channelId: message.channelId, message }))
        }

        const handleError = (errorMessage) => {
          console.error('Socket error:', errorMessage)
          dispatch(setError(errorMessage))
          showErrorToast('toast.message.connectionError')
          logError(new Error(errorMessage), {
            type: 'socket_error',
            message: errorMessage,
          })
        }

        const handleNewChannel = (channel) => {
          dispatch(addChannelFromSocket(channel))
          logInfo('New channel added', { channel: channel.name })
        }

        const handleRenameChannel = (channel) => {
          dispatch(updateChannelFromSocket(channel))
          logInfo('Channel renamed', { channel: channel.name })
        }

        const handleRemoveChannel = (data) => {
          dispatch(removeChannelFromSocket(data))
          logInfo('Channel removed', { channelId: data.id })
        }

        handlers.handleNewMessage = handleNewMessage
        handlers.handleError = handleError
        handlers.handleNewChannel = handleNewChannel
        handlers.handleRenameChannel = handleRenameChannel
        handlers.handleRemoveChannel = handleRemoveChannel

        onNewMessage(handleNewMessage)
        onError(handleError)
        onNewChannel(handleNewChannel)
        onRenameChannel(handleRenameChannel)
        onRemoveChannel(handleRemoveChannel)
      }
      catch (error) {
        console.error('WebSocket connection error:', error)
        logError(error, {
          type: 'socket_connection_error',
          message: error.message,
        })
        if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
          logout()
          navigate('/login')
          return
        }
        dispatch(setError(t('chat.errors.connectionError')))
      }
    }

    setupSocket()

    return () => {
      if (handlers.handleNewMessage) {
        offNewMessage(handlers.handleNewMessage)
      }

      if (handlers.handleError) {
        offError(handlers.handleError)
      }
      if (handlers.handleNewChannel) {
        offNewChannel(handlers.handleNewChannel)
      }
      if (handlers.handleRenameChannel) {
        offRenameChannel(handlers.handleRenameChannel)
      }
      if (handlers.handleRemoveChannel) {
        offRemoveChannel(handlers.handleRemoveChannel)
      }

      disconnectSocket()
      dispatch(setSocketConnected(false))
    }
  }, [dispatch, navigate, t])

  const handleRenameClick = (channel) => {
    setSelectedChannel(channel)
    setShowRenameModal(true)
  }

  const handleDeleteClick = (channel) => {
    setSelectedChannel(channel)
    setShowDeleteModal(true)
    logInfo('Delete channel modal opened', { channel: channel.name })
  }

  if (loading) {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">{t('chat.main.loading')}</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column h-100">
      <Header />

      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">

          <Col md={2} className="col-4 border-end px-0 bg-light flex-column h-100 d-flex">
            <ChannelList
              onAddChannel={() => setShowAddModal(true)}
              onRenameChannel={handleRenameClick}
              onDeleteChannel={handleDeleteClick}
            />
          </Col>

          <Col className="p-0 h-100">
            <div className="d-flex flex-column h-100">

              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b>
                    #
                    {currentChannel ? currentChannel.name : '...'}
                  </b>
                </p>
                <span className="text-muted">
                  {t('chat.messages.count', { count: currentMessagesCount, defaultValue: `${currentMessagesCount} сообщений` })}
                </span>
              </div>

              <MessageList />

              <div className="mt-auto px-5 py-3">
                <MessageForm />
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <AddChannelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <RenameChannelModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false)
          setSelectedChannel(null)
        }}
        channel={selectedChannel}
      />

      <DeleteChannelModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedChannel(null)
        }}
        channel={selectedChannel}
      />
    </div>
  )
}

export default MainPage

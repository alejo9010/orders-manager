import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import ServerItem from '../components/ServerItem';
import {
  createServer,
  getServers,
  reset,
} from '../features/servers/serverSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../components/SpinnerFixed';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    heigth: 'auto',
    minWidth: '5rem',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

function Servers() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [serverData, setServerData] = useState({
    gameName: '',
    serverName: '',
  });

  const { gameName, serverName } = serverData;
  const { servers, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.servers
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (isError) {
    }
    if (isSuccess && modalIsOpen && gameName && serverName) {
      toast.success(`${serverName} was added`);
      setServerData((prevState) => ({ ...prevState, serverName: '' }));
    }
    dispatch(reset());
  }, [isError, isSuccess]);

  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const server = {
      gameName: gameName.trim(),
      serverName: serverName.trim(),
      stock: 0,
      isHidden: true,
    };
    dispatch(createServer(server));
    //Delete server name
  };

  const onChange = (e) => {
    setServerData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <main className="dashboard-main">
      {isLoading && <Spinner />}
      <div className="dashboard-container">
        <div className="dashboard-bar">
          <button className="btn-round" onClick={() => setModalIsOpen(true)}>
            New Server
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <form className="form" action="" onSubmit={onSubmit}>
              <div className="form-group">
                <h1>New server</h1>
                <input
                  type="text"
                  placeholder="Game Name"
                  name="gameName"
                  onChange={onChange}
                  value={gameName}
                />
                <input
                  type="text"
                  placeholder="Server Name"
                  name="serverName"
                  onChange={onChange}
                  value={serverName}
                />
                <button className="btn">Submit</button>
              </div>
            </form>
          </Modal>
        </div>
        <div className="dashboard-table">
          <div className="header-row-3">
            <div>Game</div>
            <div>Server</div>
            <div>Stock</div>
          </div>
          {servers.map((server) => {
            if (!server.isHidden) {
              return <ServerItem key={server._id} server={server} />;
            }
          })}
        </div>
      </div>
    </main>
  );
}

export default Servers;

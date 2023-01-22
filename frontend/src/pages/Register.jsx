import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/SpinnerFixed';
function Register() {
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const { name, email, password, password2 } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !password2) {
      toast.error('Fill all information');
    } else if (password !== password2) {
      toast.error('Passwords must match');
    } else {
      const userData = {
        name,
        email,
        password,
      };
      dispatch(register(userData));
    }
  };

  return (
    <div className="container">
      {isLoading && <Spinner />}
      <div className="card">
        <h2 className="card-title">Sign Up</h2>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              placeholder="Name"
              type="text"
              name="name"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <input
              placeholder="Email"
              type="email"
              name="email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password2"
              placeholder="Confirm password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
      <Link to="/login" className="link">
        Sign In
      </Link>
    </div>
  );
}

export default Register;

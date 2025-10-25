import { FormInput, SubmitBtn } from '../../components/index';
import {
  Form,
  Link,
  redirect,
  useNavigate,
  type ActionFunctionArgs,
} from 'react-router-dom';
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import { loginUser } from '../../features/user/userSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { IconLineWhite } from '../../assets/images';

export const action =
  (store: { dispatch: AppDispatch }) =>
  async ({ request }: ActionFunctionArgs) => {
    console.log(store);
    // const {request} = store;
    const requestFormData = await request.formData();
    const data = Object.fromEntries(requestFormData);

    // Modern React Router + Rails format
    // const payload = { user: data};

    try {
      // Convert to FormData to avoid preflight
      const formData = new FormData();
      formData.append('user[email]', data.email);
      formData.append('user[password]', data.password);

      const response = await customFetch.post('/users/login', formData);
      console.log(response);

      // Data and Token extraction
      const token = response.headers.authorization; // Keep the full "Bearer <token>" format
      const userData = response.data.data;

      store.dispatch(loginUser({ user: userData, token }));
      console.log(`login.tsx user: userdata`, userData);
      toast.success('logged in successfully');
      return redirect('/');
    } catch (error) {
      console.log('Try-Catch Login Error:', error);
      const err = error as AxiosError<{ error: { message: string } }>;
      const errorMessage =
        err.response?.data?.error?.message || 'Invalid credentials';
      toast.error(errorMessage);
      return null;
    }
  };

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginAsGuestUser = async () => {
    try {
      const formData = new FormData();
      formData.append('user[email]', 'manuel@test.com');
      formData.append('user[password]', 'test123456');

      const response = await customFetch.post('/users/login', formData);

      // Extract token and user data (same as form submission)
      const token = response.headers.authorization; // Keep the full "Bearer <token>" format
      const userData = response.data.data;

      dispatch(loginUser({ user: userData, token }));
      toast.success('Welcome, guest user');
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error('Please try again');
    }
  };

  return (
    <section className="h-screen bg-primary grid place-items-center">
      <Form
        method="post"
        className="card w-120 p-8 bg-[#001a33] shadow-lg flex flex-col"
        autoComplete="off"
      >
        <h4 className="text-center font-primary text-3xl uppercase">LOGIN</h4>
        <div className="relative h-[11px] w-[67px] mx-auto mb-5">
          <img
            src={IconLineWhite}
            className="icon-line-dark h-[11px] w-[67px] mx-auto"
          />
        </div>
        <div className="flex flex-col mx-10 font-secondary">
          <FormInput
            type="email"
            label="Email (required)"
            name="email"
            placeholder="email@email.com"
          />
          <FormInput
            type="password"
            label="Password (required)"
            name="password"
            placeholder="pass1234"
          />

          <div className="flex flex-col w-full gap-y-2 my-8">
            <div className="mb-1">
              <SubmitBtn text="Login" />
            </div>
            <div className="flex flex-row w-full gap-x-4 mb-2">
              <button
                type="button"
                className="btn btn-secondary border-none shadow-none outline-none text-white bg-primary flex-1"
              >
                Google
              </button>
              <button
                type="button"
                className="btn btn-secondary border-none shadow-none outline-none text-white bg-primary flex-1"
              >
                Facebook
              </button>
            </div>
            <Link to="/" className="w-full">
              <button
                type="button"
                className="btn bg-neutral-500 text-[#ffffff] btn-block border-none shadow-none outline-none w-full"
              >
                Cancel
              </button>
            </Link>
          </div>
          <p className="text-center">
            Not yet registered?
            <Link
              to="/signup"
              className="text-accent ml-2 link link-hover link-secondary capitalize"
            >
              Register
            </Link>
          </p>
        </div>
      </Form>
    </section>
  );
};
export default Login;

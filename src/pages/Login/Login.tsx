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
    console.log('Login.tsx action: Starting login process');
    console.log('Login.tsx action: Store:', store);
    
    const requestFormData = await request.formData();
    const data = Object.fromEntries(requestFormData);
    console.log('Login.tsx action: Form data:', data);

    try {
      // Convert to FormData to avoid preflight
      const formData = new FormData();
      formData.append('user[email]', data.email);
      formData.append('user[password]', data.password);
      
      console.log('Login.tsx action: Sending login request to /users/login');

      const response = await customFetch.post('/users/login', formData);
      console.log('Login.tsx action: Login response received:', response);

      // Data and Token extraction
      const token = response.headers.authorization; // Keep the full "Bearer <token>" format
      const userData = response.data.data;
      
      console.log('Login.tsx action: Token:', token);
      console.log('Login.tsx action: User data:', userData);

      store.dispatch(loginUser({ user: userData, token }));
      console.log('Login.tsx action: User dispatched to store');
      
      toast.success('logged in successfully');
      console.log('Login.tsx action: Redirecting to /');
      return redirect('/');
    } catch (error) {
      console.error('Login.tsx action: Error caught:', error);
      const err = error as AxiosError<{ error: { message: string } }>;
      const errorMessage =
        err.response?.data?.error?.message || 'Invalid credentials';
      console.error('Login.tsx action: Error message:', errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('Login.tsx component: Component rendering');
  console.log('Login.tsx component: Dispatch available:', !!dispatch);
  console.log('Login.tsx component: Navigate available:', !!navigate);

  const loginAsGuestUser = async () => {
    console.log('Login.tsx component: Guest login started');
    try {
      const formData = new FormData();
      formData.append('user[email]', 'manuel@test.com');
      formData.append('user[password]', 'test123456');

      console.log('Login.tsx component: Sending guest login request');
      const response = await customFetch.post('/users/login', formData);
      console.log('Login.tsx component: Guest login response:', response);

      // Extract token and user data (same as form submission)
      const token = response.headers.authorization; // Keep the full "Bearer <token>" format
      const userData = response.data.data;

      console.log('Login.tsx component: Guest token:', token);
      console.log('Login.tsx component: Guest user data:', userData);

      dispatch(loginUser({ user: userData, token }));
      console.log('Login.tsx component: Guest user dispatched to store');
      
      toast.success('Welcome, guest user');
      console.log('Login.tsx component: Navigating to /');
      navigate('/');
    } catch (error) {
      console.error('Login.tsx component: Guest login error:', error);
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
            <div>
              <SubmitBtn text="Login" />
            </div>
            {/* Google */}
            <button className="btn bg-white text-black border-[#e5e5e5] shadow-none ">
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Login with Google
            </button>

            {/* Facebook */}
            <button className="btn bg-[#1A77F2] text-white border-[#005fd8] shadow-none ">
              <svg
                aria-label="Facebook logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path
                  fill="white"
                  d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
                ></path>
              </svg>
              Login with Facebook
            </button>

            {/* WeChat */}
            <button className="btn bg-[#5EBB2B] text-white border-[#4eaa0c] shadow-none ">
              <svg
                aria-label="WeChat logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <g fill="white">
                  <path d="M11.606,3.068C5.031,3.068,0,7.529,0,12.393s4.344,7.681,4.344,7.681l-.706,2.676c-.093,.353,.284,.644,.602,.464l3.173-1.798c1.403,.447,4.381,.59,4.671,.603-.208-.721-.311-1.432-.311-2.095,0-3.754,3.268-9.04,10.532-9.04,.165,0,.331,.004,.496,.011-.965-4.627-5.769-7.827-11.195-7.827Zm-4.327,7.748c-.797,0-1.442-.646-1.442-1.442s.646-1.442,1.442-1.442,1.442,.646,1.442,1.442-.646,1.442-1.442,1.442Zm8.386,0c-.797,0-1.442-.646-1.442-1.442s.646-1.442,1.442-1.442,1.442,.646,1.442,1.442-.646,1.442-1.442,1.442Z"></path>
                  <path d="M32,19.336c0-4.26-4.998-7.379-9.694-7.379-6.642,0-9.459,4.797-9.459,7.966s2.818,7.966,9.459,7.966c1.469,0,2.762-.211,3.886-.584l2.498,1.585c.197,.125,.447-.052,.394-.279l-.567-2.46c2.36-1.643,3.483-4.234,3.483-6.815Zm-12.73-.81c-.704,0-1.275-.571-1.275-1.275s.571-1.275,1.275-1.275,1.275,.571,1.275,1.275c0,.705-.571,1.275-1.275,1.275Zm6.373,0c-.704,0-1.275-.571-1.275-1.275s.571-1.275,1.275-1.275,1.275,.571,1.275,1.275-.571,1.275-1.275,1.275Z"></path>
                </g>
              </svg>
              Login with WeChat
            </button>
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

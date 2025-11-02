import { useEffect, useState } from 'react';
import { FormInput, SubmitBtn } from '../../components/index';
import {
  Form,
  Link,
  redirect,
  type ActionFunctionArgs,
} from 'react-router-dom';
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import { IconLineWhite } from '../../assets/images';

// interface Country {
//   id: number;
//   name: string;
//   code: string;
// }

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Add userDetailAttributes
  // user["key"]
  // If reach dob,
  // Add to userDetailAttributes
  // Append userDetailAttributes submitData

  // Convert to FormData to avoid preflight (same fix as login)
  const submitData = new FormData();
  console.log(`submitData`, submitData);

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'first_name' || key === 'last_name' || key === 'dob') {
      submitData.append(
        `user[user_detail_attributes][${key}]`,
        value as string
      );
    } else {
      submitData.append(`user[${key}]`, value as string);
    }
    console.log(`submitData append ${key}:`, value);
  });

  try {
    await customFetch.post('/users/signup', submitData);
    toast.success('account created successfully');
    return redirect('/login');
  } catch (error) {
    const err = error as AxiosError<{ error: { message: string } }>;
    console.log(err.response?.data);
    const errorMessage =
      err.response?.data?.error?.message || 'Double check thy credentials';
    toast.error(errorMessage);
    return null;
  }
};

import { useRef } from 'react';

const requiredFields = [
  'email',
  'password',
  'password_confirmation',
  'first_name',
  'last_name',
  'dob',
];

const Signup = () => {
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // For focusing the first error
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: !value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    let hasError = false;
    const newErrors: { [key: string]: boolean } = {};
    requiredFields.forEach((field) => {
      const inputElement = inputRefs.current[field];
      if (!inputElement || !inputElement.value) {
        newErrors[field] = true;
        hasError = true;
      }
    });
    setErrors(newErrors);
  setTouched((prev) => ({ ...prev, ...Object.fromEntries(requiredFields.map(field => [field, true])) }));
    if (hasError) {
      // Focus first error
  const first = requiredFields.find((field) => newErrors[field]);
  if (first && inputRefs.current[first]) inputRefs.current[first]?.focus();
      e.preventDefault();
    }
  };

   const today = new Date();
   const year = today.getFullYear();
   const month = String(today.getMonth() + 1).padStart(2, '0');
   const day = String(today.getDate()).padStart(2, '0');
   const formattedDate = `${year}-${month}-${day}`;

  // const [countries, setCountries] = useState<Country[]>([]);

  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     const res = await customFetch.get('/countries');
  //     setCountries(res.data);
  //   };
  //   fetchCountries();
  // }, []);

  // Check if any required field is empty
  const isAnyFieldEmpty = requiredFields.some(
    (field) => !inputRefs.current[field] || !inputRefs.current[field]?.value
  );

  return (
    <section className="h-screen bg-primary grid place-items-center">
      <Form
        method="POST"
        className="card w-120 p-8 bg-[#001a33] shadow-lg flex flex-col"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h4 className="text-center font-primary text-3xl uppercase">
          REGISTRATION
        </h4>
        <div className="relative h-[11px] w-[67px] mx-auto mb-5">
          <img
            src={IconLineWhite}
            className="icon-line-dark h-[11px] w-[67px] mx-auto"
          />
        </div>
        <div className="flex flex-col gap-x-10 mx-10 font-secondary">
          <FormInput
            type="email"
            label="Email*"
            name="email"
            placeholder="user@email.com"
            inputRef={inputElement => (inputRefs.current.email = inputElement)}
            onBlur={handleBlur}
            error={!!errors.email && touched.email}
          />
          <FormInput
            type="password"
            label="Password*"
            name="password"
            placeholder="user123456"
            inputRef={inputElement => (inputRefs.current.password = inputElement)}
            onBlur={handleBlur}
            error={!!errors.password && touched.password}
          />
          <FormInput
            type="password"
            label="Password Confirmation*"
            name="password_confirmation"
            placeholder="user123456"
            inputRef={inputElement => (inputRefs.current.password_confirmation = inputElement)}
            onBlur={handleBlur}
            error={!!errors.password_confirmation && touched.password_confirmation}
          />
          <FormInput
            type="text"
            label="First Name*"
            name="first_name"
            placeholder="Bien"
            inputRef={inputElement => (inputRefs.current.first_name = inputElement)}
            onBlur={handleBlur}
            error={!!errors.first_name && touched.first_name}
          />
          <FormInput
            type="text"
            label="Last Name*"
            name="last_name"
            placeholder="Sayson"
            inputRef={inputElement => (inputRefs.current.last_name = inputElement)}
            onBlur={handleBlur}
            error={!!errors.last_name && touched.last_name}
          />
          <FormInput
            type="date"
            label="Date of Birth*"
            name="dob"
            placeholder="1990/01/01"
            inputRef={inputElement => (inputRefs.current.dob = inputElement)}
            onBlur={handleBlur}
            error={!!errors.dob && touched.dob}
            min='1901-01-01'
            max={formattedDate}
          />
          <div className="my-6 gap-y-4 flex flex-row w-full space-x-4">
            <Link to="/" className="flex-1">
              <button className="btn bg-neutral-500 text-[#ffffff] btn-block border-none shadow-none outline-none mb-2 w-full flex-1">
                Cancel
              </button>
            </Link>
            <div className="flex-1">
              <SubmitBtn text="Sign Up" disabled={isAnyFieldEmpty} />
            </div>
          </div>
          <p className="text-center">
            Already a member?
            <Link
              to="/login"
              className="text-accent ml-2 link link-hover link-secondary capitalize"
            >
              Login
            </Link>
          </p>
        </div>
      </Form>
    </section>
  );
};
export default Signup;

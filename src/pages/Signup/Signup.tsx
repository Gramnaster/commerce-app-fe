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
  // const user_detail_attributes = { };
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'first_name' || key === "last_name" || key === "dob") {
      // user_detail_attributes[key] = value as string;
      submitData.append(`user[user_detail_attributes][${key}]`, value as string);
      // console.log(`userDetailAttributes[key]`, user_detail_attributes, key);
      // submitData.append(`user[user_detail_attributes][${key}]`, value as string)
    } else {
      submitData.append(`user[${key}]`, value as string);
    }
    // console.log(`userDetailAttributes`, userDetailAttributes)
    console.log(`submitData append ${key}:`, value);
  });

  // submitData.append(`user[${user_detail_attributes}]`, JSON.stringify(user_detail_attributes));

  // submitData.append(`user[${userDetailAttributes}]`, );
  // console.log(`submitData`, submitData);

  // console.log(`submitData`, submitData.entries());
  // for (const [key, value] of submitData.entries()) {
    // submitData.append(`user[${user_detail_attributes}][${key}]`, value);
  //   console.log(`submitData.entries key:`, JSON.stringify(key), value);
  // }
  // console.log(`data`, data);

  try {
    await customFetch.post('/users/signup', submitData);
    toast.success('account created successfully');
    return redirect('/login');

  } catch (error) {
    const err = error as AxiosError<{ error: { message: string } }>;
    const errorMessage =
      err.response?.data?.error?.message || 'Double check thy credentials';
    toast.error(errorMessage);
    return null;
  }
};

const Signup = () => {
  // const [countries, setCountries] = useState<Country[]>([]);

  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     const res = await customFetch.get('/countries');
  //     setCountries(res.data);
  //   };
  //   fetchCountries();
  // }, []);

  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-150 p-8 bg-base shadow-lg flex flex-col gap-y-4"
      >
        <h4> Sign Up to THE COMPANY </h4>
        <div className="flex flex-row">
          <div className="flex flex-col gap-x-10 mx-10">
            <FormInput
              type="email"
              label="Email (required)"
              name="email"
              placeholder="user@email.com"
            />
            <FormInput
              type="password"
              label="Password (required)"
              name="password"
              placeholder="user123456"
            />
            <FormInput
              type="password"
              label="Password Confirmation (required)"
              name="password_confirmation"
              placeholder="user123456"
            />
            <FormInput
              type="text"
              label="First Name (required)"
              name="first_name"
              placeholder="Bien"
            />
            <FormInput
              type="text"
              label="Last Name (required)"
              name="last_name"
              placeholder="Sayson"
            />
            <FormInput
              type="date"
              label="Date of Birth (required)"
              name="dob"
              placeholder="1990/01/01"
            />
            <div className="my-4 gap-y-4">
              <Link to="/">
                <button className="btn bg-neutral-800 btn-block">Cancel</button>
              </Link>
              <SubmitBtn text="Sign Up" />
            </div>
            <p>
              Already a member?
              <Link
                to="/login"
                className="ml-2 link link-hover link-secondary capitalize"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </Form>
    </section>
  );
}
export default Signup
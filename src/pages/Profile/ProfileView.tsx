import { useState } from "react";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../../utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

// From action loader, we'll get the stored user id

export interface User {
  id: number;
  email: string;
}

export const loader = (queryClient: any, store: any) => async ({ params }: any) => {
  const storeState = store.getState();
  const user = storeState.userState?.user;
  console.log(`ProfileView user`, user);

  const id = params.id;

  if (!id) {
    toast.error('User ID is required');
  }

  const userDetailsQuery = {
    queryKey: ['userDetails', id],
    queryFn: async () => {
      const response = await customFetch.get(`/users/${id}`, {
        headers: {
          Authorization: user.token,
        },
      });
      return response.data;
    },
  };

  try {
    const userDetails = await queryClient.ensureQueryData(userDetailsQuery);
    return { userDetails };
  } catch (error: any) {
    console.error('Failed to load user:', error);
    toast.error('Failed to load user details');
    return redirect('/admin');
  }
};

const ProfileView = () => {
    const { userDetails} = useLoaderData() as { 
    userDetails: User; 
  };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.userState.user);
  // const { userDetails } = useLoaderData() as { userDetails: User };

    // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await customFetch.patch(
        `/users/${userDetails.id}`,
        {
          user: userData,
        },
        {
          headers: {
            Authorization: user?.token,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['userDetails', userDetails.id.toString()] });
      navigate('/admin');
    },
    onError: (error: any) => {
      console.error('Update failed:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update user';
      toast.error(errorMessage);
    },
  });


  return (
    <div>{user.id}</div>
  )
}
export default ProfileView
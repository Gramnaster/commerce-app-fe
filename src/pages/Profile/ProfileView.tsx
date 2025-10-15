import { useState } from "react";

// From action loader, we'll get the stored user id

export const loader = (queryClient: any, store: any) => async ({ params }: any) => {
  const storeState = store.getState();
  const user = storeState.userState?.user;

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
  const [id, setId] = useState(0);

  return (
    <div>ProfileView</div>
  )
}
export default ProfileView
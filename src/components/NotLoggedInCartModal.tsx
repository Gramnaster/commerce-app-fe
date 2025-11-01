import { useNavigate } from 'react-router-dom';

const NotLoggedInCartModal = () => {
  const navigate = useNavigate();

  console.log('NotLoggedInCartModal: Component rendering');

  const handleNavigate = (path: string) => {
    console.log('NotLoggedInCartModal: handleNavigate called with path:', path);
    const modal = document.getElementById('login_cart_modal') as HTMLDialogElement;
    console.log('NotLoggedInCartModal: Modal element found:', !!modal);
    modal?.close();
    console.log('NotLoggedInCartModal: Modal closed, navigating to:', path);
    // Use setTimeout to ensure modal closes before navigation
    setTimeout(() => {
      console.log('NotLoggedInCartModal: Executing navigation to:', path);
      navigate(path);
    }, 0);
  };

  return (
    <dialog id="login_cart_modal" className="modal">
      <div className="modal-box w-10/12 max-w-2xl">
        {/* Close button - using form method dialog to close */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        {/* Header */}
        <h3 className="font-bold text-2xl text-base-content mb-6 text-center">
          Please login before adding to your cart!
        </h3>

        {/* Buttons */}
        <div className="flex flex-row items-center justify-center gap-x-4 mt-6">
          <form method="dialog">
            <button className="btn bg-[#4d4d4d] text-white w-[150px]">
              Continue Browsing
            </button>
          </form>

          <button
            onClick={() => handleNavigate('/login')}
            className="btn btn-error text-white w-[150px]"
          >
            Login
          </button>

          <button
            onClick={() => handleNavigate('/signup')}
            className="btn btn-error text-white w-[150px]"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Modal backdrop - clicking outside closes the modal */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default NotLoggedInCartModal;

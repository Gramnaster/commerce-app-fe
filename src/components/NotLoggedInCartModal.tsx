import { Link } from 'react-router-dom';

const NotLoggedInCartModal = () => {
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

          <Link
            to="/login"
            className="btn btn-error text-white w-[150px]"
            onClick={() => {
              // Close modal when navigating
              const modal = document.getElementById('login_cart_modal') as HTMLDialogElement;
              modal?.close();
            }}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="btn btn-error text-white w-[150px]"
            onClick={() => {
              // Close modal when navigating
              const modal = document.getElementById('login_cart_modal') as HTMLDialogElement;
              modal?.close();
            }}
          >
            Sign Up
          </Link>
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

import { Link, useRouteError } from 'react-router-dom';

const Error = () => {
  const error: any = useRouteError();
  console.log(error);

  const is404 = error && error.status === 404;

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          {is404 ? (
            <>
              <span className="text-6xl font-bold text-error mb-2">404</span>
              <h1 className="card-title text-error text-2xl font-bold mb-2">Page Not Found</h1>
              <p className="mb-4 text-error ">Sorry, we couldn't find the page you're looking for.</p>
            </>
          ) : (
            <>
              <h2 className="card-title text-2xl font-bold mb-2 text-error ">Oops! Something went wrong</h2>
              <p className="mb-4 text-error ">There was an error loading this page.</p>
            </>
          )}
          <Link to="/">
            <button type="button" className="btn btn-primary mt-2">Return Home</button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Error;

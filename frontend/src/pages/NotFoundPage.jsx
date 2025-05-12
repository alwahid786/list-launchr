import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-9xl font-headline font-bold text-primary">404</h1>
      <h2 className="text-3xl font-headline font-bold text-neutral mt-4 mb-6">Page Not Found</h2>
      <p className="text-lg text-neutral-600 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link 
          to="/"
          className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
        <Link 
          to="/dashboard"
          className="px-6 py-3 bg-white text-primary border border-primary font-medium rounded-md hover:bg-blue-50 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
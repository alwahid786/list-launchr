import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();
  
  // Check if the current path is a giveaway entry page
  const isGiveawayPage = location.pathname.startsWith('/giveaway/');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Only show header on non-giveaway pages */}
      {!isGiveawayPage && <Header />}
      
      <main className={`flex-grow ${isGiveawayPage ? 'py-0' : ''}`}>
        <Outlet />
      </main>
      
      {/* Only show footer on non-giveaway pages */}
      {!isGiveawayPage && <Footer />}
    </div>
  );
};

export default MainLayout;
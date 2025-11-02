import { Outlet } from 'react-router-dom';
import { Footer, Navbar } from '../../components';

const Home = () => {
  return (
    <div className="bg-base-100" >
      <Navbar />
      <h1>
        <Outlet />
      </h1>
      <Footer />
    </div>
  );
};
export default Home;

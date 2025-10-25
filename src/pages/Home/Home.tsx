import { Outlet, useNavigation } from 'react-router-dom';
import { Footer, Navbar } from '../../components';

const Home = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';

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

import { Navbar } from '../../components'
import Sidebar from '../../components/Sidebar'
import { Outlet, useNavigation } from 'react-router-dom';

const Profile = () => {
  return (
    <div>
      <Sidebar />
        <Outlet />
      YAWA YAWA YAWA
    </div>
  )
}

export default Profile
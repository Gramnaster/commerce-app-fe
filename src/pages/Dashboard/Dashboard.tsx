// import { Outlet } from "react-router-dom"

import Categories from "./Categories"
import FeaturedProducts from "./FeaturedProducts"
import FeaturedSocials from "./FeaturedSocials"
import NewProducts from "./NewProducts"

const Dashboard = () => {
  return (
    <section>
      <FeaturedProducts />
      <Categories />
      <NewProducts />
      <FeaturedSocials />
    </section>
  )
}
export default Dashboard
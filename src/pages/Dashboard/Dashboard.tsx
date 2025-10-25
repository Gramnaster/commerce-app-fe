// import { Outlet } from "react-router-dom"

import Categories from "./Categories"
import FeaturedProducts from "./FeaturedProducts"

const Dashboard = () => {
  return (
    <section>
      <FeaturedProducts />
      <Categories />
    </section>
  )
}
export default Dashboard
// import { Outlet } from "react-router-dom"

import Categories from "./Categories"
import FeaturedProducts from "./FeaturedProducts"
import NewProducts from "./NewProducts"

const Dashboard = () => {
  return (
    <section>
      <FeaturedProducts />
      <Categories />
      <NewProducts />
    </section>
  )
}
export default Dashboard
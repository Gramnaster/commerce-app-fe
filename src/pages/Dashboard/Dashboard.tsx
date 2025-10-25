// import { Outlet } from "react-router-dom"

import { FooterCTA } from "../../components"
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
      {/* If logged in, this CTA does not appear anymore */}
      <FooterCTA />
    </section>
  )
}
export default Dashboard
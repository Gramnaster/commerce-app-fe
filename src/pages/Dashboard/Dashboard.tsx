// import { Outlet } from "react-router-dom"

import { FooterCTA } from "../../components"
import Categories from "./Categories"
import FeaturedProducts from "./FeaturedProducts"
import FeaturedSocials from "./FeaturedSocials"
import NewProducts from "./NewProducts"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.userState.user);

  return (
    <section>
      <FeaturedProducts />
      <Categories />
      <NewProducts />
      <FeaturedSocials />
      {/* If logged in, this CTA does not appear anymore */}
      {!user && <FooterCTA />}
    </section>
  )
}
export default Dashboard
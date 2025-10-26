// import { Outlet } from "react-router-dom"
import { FooterCTA } from "../../components"
import FeaturedProducts from "./FeaturedProducts"
import FeaturedSocials from "./FeaturedSocials"
import NewProducts from "./NewProducts"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import PopularCategories from "./PopularCategories"

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.userState.user);

  return (
    <section>
      <FeaturedProducts />
      <PopularCategories />
      <NewProducts />
      <FeaturedSocials />
      {/* If logged in, this CTA does not appear anymore */}
      {!user && <FooterCTA />}
    </section>
  )
}
export default Dashboard
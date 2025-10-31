import { useLocation } from 'react-router-dom';
import {
  MainCategoryMenClothes,
  MainCategoryWomenClothes,
  MainCategoryChildrenClothes,
  MainCategoryJewellery,
  MainCategoryElectronics,
  MainCategorySnacks,
  MainCategoryTrinkets,
  MainCategoryAirstrikes,
  FeaturedProduct05
} from '../../assets/images';
import { useEffect, useState } from 'react';

interface featuredImage {
  id: number;
  url: string;
}

const ProductsBanner = () => {
  const [ banner, setBanner ] = useState('')
  const currentPath = useLocation();

  const theHulk = () => {
    if (currentPath.pathname === '/products/categories/1') {
      setBanner(MainCategoryMenClothes)
    } else if (currentPath.pathname === '/products/categories/2') {
      setBanner(MainCategoryWomenClothes)
    } else if (currentPath.pathname === '/products/categories/3') {
      setBanner(MainCategoryChildrenClothes)
    } else if (currentPath.pathname === '/products/categories/4') {
      setBanner(MainCategoryJewellery)
    } else if (currentPath.pathname === '/products/categories/5') {
      setBanner(MainCategoryElectronics)
    } else if (currentPath.pathname === '/products/categories/6') {
      setBanner(MainCategorySnacks)
    } else if (currentPath.pathname === '/products/categories/7') {
      setBanner(MainCategoryTrinkets)
    } else if (currentPath.pathname === '/products/categories/8') {
      setBanner(MainCategoryAirstrikes)
    }  else {
      setBanner(FeaturedProduct05)
    }
  }

  useEffect(() => {
    theHulk()
      }
    );

  return (
    <div className="w-full">
          <div
            className=" relative w-full"
          >
            <img src={banner} className="w-full" />
          </div>
    </div>
  );
};

export default ProductsBanner;
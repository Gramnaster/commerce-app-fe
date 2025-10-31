import { useLocation, useMatch } from 'react-router-dom';
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

// interface featuredImage {
//   id: number;
//   url: string;
// }

const ProductsBanner = () => {
  const [ banner, setBanner ] = useState('')
  const currentPath = useLocation();
  
  // Check if we're on a product detail page like '/products/123'
  // useMatch checks if route matches a pattern
  const isProductDetailPage = useMatch('/products/:id');

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

  // Don't render banner on product detail pages as per Figma design
  if (isProductDetailPage) {
    return null;
  }

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
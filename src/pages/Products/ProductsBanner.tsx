import { useLocation } from 'react-router-dom';
import {
  MainCategoryMenClothes,
  MainCategoryWomenClothes,
  MainCategoryJewellery,
  MainCategoryElectronics,
  MainCategorySnacks
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
      setBanner(MainCategoryJewellery)
    } else if (currentPath.pathname === '/products/categories/4') {
      setBanner(MainCategoryElectronics)
    } else {
      setBanner(MainCategorySnacks)
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
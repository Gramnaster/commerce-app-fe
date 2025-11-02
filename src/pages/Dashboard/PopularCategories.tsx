import { NavLink } from 'react-router-dom';
import {
  IconLineDark,
  IconLineWhite,
  SmallCategoryAirstrikes,
  SmallCategoryChildrenClothes,
  SmallCategoryElectronics,
  SmallCategoryJewellery,
  SmallCategoryMenClothes,
  SmallCategorySnacks,
  SmallCategoryTrinkets,
  SmallCategoryWomenClothes,
} from '../../assets/images';

interface CategoriesLinks {
  id: number;
  url: string;
  image: string;
}

const categoriesLinks: CategoriesLinks[] = [
  { id: 0, url: '/products/categories/1', image: SmallCategoryMenClothes },
  { id: 1, url: '/products/categories/2', image: SmallCategoryWomenClothes },
  { id: 3, url: '/products/categories/3', image: SmallCategoryChildrenClothes },
  { id: 4, url: '/products/categories/4', image: SmallCategoryJewellery },
  { id: 5, url: '/products/categories/5', image: SmallCategoryElectronics },
  { id: 6, url: '/products/categories/6', image: SmallCategorySnacks },
  { id: 7, url: '/products/categories/7', image: SmallCategoryTrinkets },
  { id: 8, url: '/products/categories/8', image: SmallCategoryAirstrikes },
];

const PopularCategories = () => {
  return (
    <section className="align-element mt-[85px] my-[95px]">
      <div className='flex justify-center align-middle flex-col my-[85px]'>
        <h2 className="font-primary text-base-content text-2xl text-center">
          POPULAR CATEGORIES
        </h2>
        <div className="relative h-[11px] w-[67px] mx-auto">
          <img src={IconLineWhite} className="block dark:hidden h-[11px] w-[67px] mx-auto" />
          <img src={IconLineDark} className="hidden dark:block h-[11px] w-[67px] mx-auto" />
        </div>
      </div>
      <ul className="grid grid-cols-4 gap-[40px]">
        {categoriesLinks.map((link) => {
          const { id, url, image } = link;
          return (
            <li key={id} className="li font-secondary">
              <NavLink to={url} className="capitalize">
                <img 
                  src={image} 
                  loading="lazy"
                  decoding="async"
                  alt={`Category ${id}`}
                />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
export default PopularCategories;

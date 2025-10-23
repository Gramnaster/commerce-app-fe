import {
  FeaturedProduct01,
  FeaturedProduct02,
  FeaturedProduct03,
  FeaturedProduct04,
  FeaturedProduct05,
} from '../../assets/images';

interface featuredImage {
  id: number;
  url: string;
}

const featuredImages: featuredImage[] = [
  { id: 0, url: FeaturedProduct01 },
  { id: 1, url: FeaturedProduct02 },
  { id: 2, url: FeaturedProduct03 },
  { id: 3, url: FeaturedProduct04 },
  { id: 4, url: FeaturedProduct05 },
];

const FeaturedProducts = () => {
  return (
    <div className="carousel w-full">
      {featuredImages.map((image, idx) => {
        const total = featuredImages.length;
        const prevIdx = (idx - 1 + total) % total;
        const nextIdx = (idx + 1) % total;
        return (
          <div
            key={image.id}
            id={`slide${idx + 1}`}
            className="carousel-item relative w-full"
          >
            <img src={image.url} className="w-full" />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href={`#slide${prevIdx + 1}`} className="btn btn-circle">
                ❮
              </a>
              <a href={`#slide${nextIdx + 1}`} className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedProducts;
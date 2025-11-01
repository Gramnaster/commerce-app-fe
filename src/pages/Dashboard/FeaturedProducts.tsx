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
      {featuredImages.map((image, index) => {
        const total = featuredImages.length;
        const prevIndex = (index - 1 + total) % total;
        const nextIndex = (index + 1) % total;
        return (
          <div
            key={image.id}
            id={`slide${index + 1}`}
            className="carousel-item relative w-full"
          >
            <img src={image.url} className="w-full" />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a
                href={`#slide${prevIndex + 1}`}
                className="btn btn-circle items-center"
              >
                ❮
              </a>
              <a
                href={`#slide${nextIndex + 1}`}
                className="btn btn-circle items-center"
              >
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
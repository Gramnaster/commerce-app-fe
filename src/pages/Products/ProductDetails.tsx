import { formatDate } from '../../utils';
import type { Product } from './Products';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <section>
      {/* SUB-DETAILS */}
      <div className="flex flex-row mb-20">
        {/* PRIMARY SUB-DETAILS */}
        <div className=" font-secondary w-3/9 mr-5">
          <h4 className="font-secondary mb-3">PRODUCT DETAILS</h4>
          <div className=" flex flex-row gap-x-2 mb-[20px]">
            <h5 className="font-secondary">Weight: </h5>
            <p className="font-light">0.15kg / 28.1lbs</p>
          </div>
          <div className=" flex flex-col gap-x-2 mb-[20px]">
            <h5 className="font-secondary">Materials / Ingredients: </h5>
            <p className="font-light">
              Oxygen (1%), Hydrogen (5%), Carbon Dioxide (87%), Cucumber (54%),
              Orange (99%), Sugar (35%)
            </p>
          </div>
          <div className=" flex flex-col gap-x-2 mb-[20px]">
            <h5 className="font-secondary">Country of Origin: </h5>
            <p className="font-light">Philippines</p>
          </div>
        </div>

        {/* TEXT DESCRIPTION */}
        <div className="w-6/9 font-secondary font-light">
          <p className="mb-3">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos.
          </p>

          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis.
          </p>
        </div>
      </div>

      {/* COMPANY DETAILS */}
      <div className="flex flex-row mb-20 font-secondary">
        {/* PRIMARY SUB-DETAILS */}
        <div className="w-3/9 mr-5">
          <h4 className="font-secondary mb-3">COMPANY DETAILS</h4>
          <div className=" flex flex-row gap-x-2 mb-[20px]">
            <h5>Company: </h5>
            <p className="font-light">{product.producer.title}</p>
          </div>
          <div className=" flex flex-col gap-x-2 mb-[20px]">
            <h5 className="font-secondary">Address: </h5>
            <p className="font-light">
              {product.producer.address.unit_no}{' '}
              {product.producer.address.street_no},{' '}
              {product.producer.address.barangay},{' '}
              {product.producer.address.city},{' '}
              {product.producer.address.zipcode},{' '}
              {product.producer.address.country}
            </p>
          </div>
          <div className=" flex flex-col gap-x-2 mb-[20px]">
            <h5 className="font-secondary">Date First Available: </h5>
            <p className="font-light">{formatDate(product.created_at)}</p>
          </div>
        </div>

        {/* TEXT DESCRIPTION */}
        <div className="w-6/9 font-secondary font-light">
          <p className="mb-3">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos.
          </p>

          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis.
          </p>
        </div>
      </div>

      {/* CUSTOMERS ALSO BOUGHT */}
      <div></div>
    </section>
  );
};

export default ProductDetails;

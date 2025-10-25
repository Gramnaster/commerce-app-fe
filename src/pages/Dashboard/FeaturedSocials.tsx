import { IconLineDark, IconLineWhite } from '../../assets/images';

const FeaturedSocials = () => {
  return (
    <section className="align-element text-base-content">
      <div className="flex justify-center align-middle flex-col my-[85px]">
        <h2 className="font-primary text-base-content text-2xl text-center">
          SOCIAL PROGRAMS
        </h2>
        <div className="relative h-[11px] w-[67px] mx-auto">
          <img
            src={IconLineWhite}
            className="block dark:hidden h-[11px] w-[67px] mx-auto"
          />
          <img
            src={IconLineDark}
            className="hidden dark:block h-[11px] w-[67px] mx-auto"
          />
        </div>
        <p>
          <span>You decide where a portion of your money goes.</span>
        </p>
        <p>
          <span>JP&B</span>partners with over dozens of charities and social
          programs across the Philippines. A portion of your total cost will
          always go to a charity of your choosing. If you do not select a
          charity, we will find a partner near your shipping address and donate
          to them instead.
        </p>
      </div>
      <div></div>
    </section>
  );
};
export default FeaturedSocials;

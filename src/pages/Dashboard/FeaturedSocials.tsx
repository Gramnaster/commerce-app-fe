import { NavLink } from 'react-router-dom';
import { socialPrograms } from '../../assets/data/socialPrograms';
import { IconLineDark, IconLineWhite } from '../../assets/images';

const FeaturedSocials = () => {
  return (
    <section className="align-social text-base-content">
      <div className="flex justify-center align-middle flex-col my-[85px] text-center">
        <h2 className="font-primary text-base-content text-2xl ">
          SOCIAL PROGRAMS
        </h2>
        <div className="relative h-[11px] w-[67px] mx-auto mb-[20px]">
          <img
            src={IconLineWhite}
            className="block dark:hidden h-[11px] w-[67px] mx-auto"
          />
          <img
            src={IconLineDark}
            className="hidden dark:block h-[11px] w-[67px] mx-auto"
          />
        </div>
        <div className="align-social w-[575px] flex flex-col text-center font-secondary">
          <p className="my-[20px]">
            You decide where a portion of your money goes.
          </p>
          <p className="font-light">
            <span className="font-black">JP</span>
            <span className="font-medium">&</span>
            <span className="font-black">B</span> partners with over dozens of
            charities and social programs across the Philippines. A portion of
            your total cost will always go to a charity of your choosing. If you
            do not select a charity, we will find a partner near your shipping
            address and donate to them instead.
          </p>
        </div>
      </div>
      <div className="align-social flex-col">
        {socialPrograms.map((program: socialPrograms) => {
          const { id, img, title, description } = program;
          // Truncate description to 250 characters
          const shortDescription = description.length > 280
            ? description.slice(0, 280) + '...'
            : description;
          if (id % 2 === 0) {
            return (
              <li
                key={id}
                className="li flex flex-row items-end h-[316px] mb-[120px]"
              >
                <img
                  src={img}
                  alt={title}
                  style={{ width: '724px', height: '316px', objectFit: 'cover' }}
                  className="pr-[20px]"
                />
                <div className="h-full flex flex-col justify-between max-w-[370px]">
                  <div>
                    <h3 className="uppercase font-secondary font-normal text-[32px] pb-4">
                      {title}
                    </h3>
                    <p className="font-secondary font-light ">{shortDescription}</p>
                  </div>
                  <div className="flex justify-end underline underline-offset-2 mt-4">
                    <NavLink to={`/socials/${id}`}>Read More... </NavLink>
                  </div>
                </div>
              </li>
            );
          } else if (id % 2 === 1) {
            return (
              <li
                key={id}
                className="li flex flex-row items-end h-[316px] mb-[120px]"
              >
                <div className="h-full flex flex-col justify-between max-w-[370px]">
                  <div>
                    <h3 className="uppercase font-secondary font-normal text-[32px] pb-4">
                      {title}
                    </h3>
                    <p className="font-secondary font-light ">{shortDescription}</p>
                  </div>
                  <div className="flex justify-end underline underline-offset-2 mt-4">
                    <NavLink to={`/socials/${id}`}>Read More... </NavLink>
                  </div>
                </div>
                <img
                  src={img}
                  alt={title}
                  style={{ width: '724px', height: '316px', objectFit: 'cover' }}
                  className="pl-[20px]"
                />
              </li>
            );
          }
          return <div>Error, mate</div>;
        })}
      </div>
      <div className='align-social text-center pb-[100px]'>
        <NavLink to="/social_programs" >
          <h3 className="font-secondary text-base-content font-normal text-base underline ">
            and dozens of other social partners here...
          </h3>
        </NavLink>
        <div className="relative h-[11px] w-[67px] mx-auto mb-[20px]">
          <img
            src={IconLineWhite}
            className="block dark:hidden h-[11px] w-[67px] mx-auto"
          />
          <img
            src={IconLineDark}
            className="hidden dark:block h-[11px] w-[67px] mx-auto"
          />
        </div>
      </div>
    </section>
  );
};
export default FeaturedSocials;

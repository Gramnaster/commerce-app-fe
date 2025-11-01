import { Link, useNavigation } from 'react-router-dom';
import { IconLineWhite } from '../assets/images';

const FooterCTA = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <div className="flex flex-col items-center bg-primary h-[155px] justify-center">
      <div className="align-element">
        <button
          type="button"
          className="btn btn-secondary items-center pb-1 w-[230px] h-[80px] rounded-full font-bold text-[32px]"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Launching...
            </>
          ) : (
            <Link to="/signup">
              <span className="font-bold text-2xl">Sign Up Now</span>
              <div className="relative h-[11px] w-[67px] mx-auto">
                <img
                  src={IconLineWhite}
                  className="icon-line-dark h-[11px] w-[67px] mx-auto"
                />
              </div>
            </Link>
          )}
          {/* {text} */}
        </button>
      </div>
    </div>
  );
};
export default FooterCTA;

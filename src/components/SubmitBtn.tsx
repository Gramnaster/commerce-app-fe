import { useNavigation } from 'react-router-dom';

interface SubmitBtnType {
  text: string;
  disabled?: boolean;
}

const SubmitBtn = ({ text, disabled }: SubmitBtnType) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const baseClass = "btn btn-secondary btn-block";
  const errorClass = disabled
    ? "border-2 border-error bg-[#570d06] text-gray-500 bg-opacity-100"
    : "";
    
  return (
    <button
      type="submit"
      className={`${baseClass} ${errorClass}`}
      disabled={isSubmitting || disabled}
    >
      {
        isSubmitting ? <>
        <span className="loading loading-spinner"></span>
        Sending...</> : text
      }
    </button>
  );
};
export default SubmitBtn;

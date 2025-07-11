import { useNavigate } from "react-router-dom";
import classes from "./BackButton.module.scss";

const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className={classes.layout}>
      <button className={classes.backButton} onClick={handleClick}>
        Back
      </button>
    </div>
  );
};

export default BackButton;

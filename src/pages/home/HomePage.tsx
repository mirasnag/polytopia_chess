import StarfieldBackground from "@components/StarfieldBackground";
import classes from "./HomePage.module.scss";

const HomePage = () => {
  return (
    <div className="page">
      <StarfieldBackground />
      <div className={classes.layout}>
        <div className=""></div>
      </div>
    </div>
  );
};

export default HomePage;

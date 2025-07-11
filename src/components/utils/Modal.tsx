// react
import { useState, type ReactNode } from "react";

// styles
import classes from "./Modal.module.scss";

interface Props {
  size: "full" | "small";
  children: ReactNode;
  showCloseButton?: boolean;
}

const Modal: React.FC<Props> = ({
  size,
  showCloseButton = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleCloseButtonClick = () => [setIsOpen(false)];

  return (
    <>
      {isOpen && (
        <div className={`${classes.layout} ${classes[size]}`}>
          <div className={classes.backdrop} />
          <div className={classes.container}>
            <div className={classes.content}>{children}</div>
            {showCloseButton && (
              <div className={classes.closeButton}>
                <button onClick={handleCloseButtonClick}>OK</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

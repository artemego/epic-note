import styles from "./actionMenu.module.scss";
import { Icon } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const MENU_WIDTH = 150;
const MENU_HEIGHT = 40;

const ActionMenu = ({ position, actions }) => {
  const x = position.x - MENU_WIDTH / 2;
  const y = position.y - MENU_HEIGHT - 10;

  return (
    <div
      className={styles.menuWrapper}
      style={{
        top: y,
        left: x,
      }}
    >
      <div className={styles.menu}>
        <span
          id="turn-into"
          className={styles.menuItem}
          role="button"
          tabIndex="0"
          onClick={() => actions.turnInto()}
        >
          Turn into
        </span>
        <span
          id="delete"
          className={styles.menuItem}
          role="button"
          tabIndex="0"
          onClick={() => actions.deleteBlock()}
        >
          <Icon as={DeleteIcon} />
        </span>
      </div>
    </div>
  );
};

export default ActionMenu;

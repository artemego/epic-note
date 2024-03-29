import React from "react";
import { matchSorter } from "match-sorter";
import styles from "./selectMenu.module.scss";

const MENU_HEIGHT = 150;
const allowedTags = [
  {
    id: "page-title",
    tag: "h1",
    label: "Page Title",
  },
  {
    id: "heading",
    tag: "h2",
    label: "Heading",
  },
  {
    id: "subheading",
    tag: "h3",
    label: "Subheading",
  },
  {
    id: "paragraph",
    tag: "p",
    label: "Paragraph",
  },
  {
    id: "counter",
    tag: "btn",
    label: "Counter",
  },
  {
    id: "unordered",
    tag: "unordered",
    label: "Unordered list",
  },
  {
    id: "ordered",
    tag: "ordered",
    label: "Ordered list",
  },
  {
    id: "toggle",
    tag: "toggle",
    label: "Toggle list",
  },
  {
    id: "todo",
    tag: "todolist",
    label: "Todo list",
  },
];

class SelectMenu extends React.Component {
  constructor(props) {
    super(props);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.state = {
      command: "",
      items: allowedTags,
      selectedItem: 0,
    };
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyDownHandler);
  }

  componentDidUpdate(prevProps, prevState) {
    const command = this.state.command;
    if (prevState.command !== command) {
      const items = matchSorter(allowedTags, command, { keys: ["tag"] });
      this.setState({ items: items });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyDownHandler);
  }

  keyDownHandler(e) {
    const items = this.state.items;
    const selected = this.state.selectedItem;
    const command = this.state.command;

    switch (e.key) {
      case "Enter":
        // здесь на enter просто приходит любое введенное значение, даже не проверяется на верность тэга
        e.preventDefault();
        if (!items[selected]?.tag) return;
        this.props.onSelect(items[selected]?.tag);
        break;
      case "Backspace":
        if (!command) this.props.close();
        this.setState({ command: command.substring(0, command.length - 1) });
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevSelected = selected === 0 ? items.length - 1 : selected - 1;
        this.setState({ selectedItem: prevSelected });
        break;
      case "ArrowDown":
      case "Tab":
        e.preventDefault();
        const nextSelected = selected === items.length - 1 ? 0 : selected + 1;
        this.setState({ selectedItem: nextSelected });
        break;

      default:
        this.setState({ command: this.state.command + e.key });
        break;
    }
  }

  render() {
    const isMenuOutsideOfTopViewport = this.props.position.y - 353 < 0;
    const y = !isMenuOutsideOfTopViewport
      ? this.props.position.y - MENU_HEIGHT
      : this.props.position.y + MENU_HEIGHT / 3 - 20;
    const x = this.props.position.x;

    return (
      <div
        ref={this.menuRef}
        className={styles.selectMenu}
        style={{
          top: y,
          left: x,
          justifyContent: !isMenuOutsideOfTopViewport
            ? "flex-end"
            : "flex-start",
        }}
      >
        <div className={styles.Items}>
          {this.state.items.map((item, key) => {
            const selectedItem = this.state.selectedItem;
            const isSelected = this.state.items.indexOf(item) === selectedItem;
            return (
              <div
                className={isSelected ? styles.selected : null}
                key={key}
                role="button"
                tabIndex="0"
                onClick={() => this.props.onSelect(item.tag)}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SelectMenu;

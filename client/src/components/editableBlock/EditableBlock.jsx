import React from "react";
import ContentEditable from "react-contenteditable";
import { getCaretCoordinates } from "../../helpers/getCaretCoordinates";
import { setCaretToEnd } from "../../helpers/setCaretToEnd";
import SelectMenu from "../selectMenu/SelectMenu";
import styles from "./editableBlock.module.css";

class EditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    this.openSelectMenuHandler = this.openSelectMenuHandler.bind(this);
    this.closeSelectMenuHandler = this.closeSelectMenuHandler.bind(this);
    this.tagSelectionHandler = this.tagSelectionHandler.bind(this);
    this.addPlaceholder = this.addPlaceholder.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      htmlBackup: null,
      html: "",
      tag: "p",
      previousKey: "",
      selectMenuIsOpen: false,
      selectMenuPosition: {
        x: null,
        y: null,
      },
      isTyping: false,
      placeholder: false,
    };
  }

  componentDidMount() {
    // console.log("did mount");
    // Добавляем placeholder пост, если у первого блока нет вложенных элементов и нет контента.
    const hasPlaceholder = this.addPlaceholder({
      block: this.contentEditable.current,
      position: this.props.position,
      content: this.props.html,
    });
    if (!hasPlaceholder) {
      this.setState({ html: this.props.html, tag: this.props.tag });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("in cdu of block");
    const stoppedTyping = prevState.isTyping && !this.state.isTyping;
    const hasNoPlaceholder = !this.state.placeholder;
    // берем html из пропсов, потому что нам надо сравнить html до начала печатания с html когда пользователь закончил печатать.
    const htmlChanged = this.props.html !== this.state.html;
    const tagChanged = prevState.tag !== this.state.tag;

    if (((stoppedTyping && htmlChanged) || tagChanged) && hasNoPlaceholder) {
      console.log("in update page");
      this.props.updatePage({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
      });
    }
  }

  onChangeHandler(e) {
    // console.log("Regular on change");
    // Здесь сеттится новый html

    this.setState({ html: e.target.value });
  }

  handleFocus() {
    // If a placeholder is set, we remove it when the block gets focused
    if (this.state.placeholder) {
      this.setState({
        ...this.state,
        html: "",
        placeholder: false,
        isTyping: true,
      });
    } else {
      this.setState({ ...this.state, isTyping: true });
    }
  }

  handleBlur(e) {
    // Показываем placeholder, если после blur все еще единственный и пустой.
    const hasPlaceholder = this.addPlaceholder({
      block: this.contentEditable.current,
      position: this.props.position,
      content: this.state.html || this.state.imageUrl,
    });
    if (!hasPlaceholder) {
      this.setState({ ...this.state, isTyping: false });
    }
  }

  // Показываем placeholder для пустых страниц. Сетаем state элемента как placeholder, возвращаем true если это первый пустой элемент и других элементов нет.
  addPlaceholder({ block, position, content }) {
    const isFirstBlockWithoutHtml = position === 1 && !content;
    const isFirstBlockWithoutSibling = !block.parentElement.nextElementSibling;
    if (isFirstBlockWithoutHtml && isFirstBlockWithoutSibling) {
      this.setState({
        ...this.state,
        html: "Type a page title...",
        tag: "h1",
        imageUrl: "",
        placeholder: true,
        isTyping: false,
      });
      return true;
    } else {
      return false;
    }
  }

  onKeyDownHandler(e) {
    if (e.key === "/") {
      this.setState({ htmlBackup: this.state.html });
    }
    if (e.key === "Enter") {
      if (this.state.previousKey !== "Shift") {
        e.preventDefault();
        this.props.addBlock({
          id: this.props.id,
          ref: this.contentEditable.current,
        });
      }
    }
    if (e.key === "Backspace" && !this.state.html) {
      e.preventDefault();
      this.props.deleteBlock({
        id: this.props.id,
        ref: this.contentEditable.current,
      });
    }
    this.setState({ previousKey: e.key });
  }

  onKeyUpHandler(e) {
    if (e.key === "/") {
      this.openSelectMenuHandler();
    }
  }

  openSelectMenuHandler() {
    const { x, y } = getCaretCoordinates();
    this.setState({
      selectMenuIsOpen: true,
      selectMenuPosition: { x, y },
    });
    document.addEventListener("click", this.closeSelectMenuHandler);
  }

  closeSelectMenuHandler() {
    this.setState({
      htmlBackup: null,
      selectMenuIsOpen: false,
      selectMenuPosition: { x: null, y: null },
    });
    document.removeEventListener("click", this.closeSelectMenuHandler);
  }

  handleMouseUp() {
    const block = this.contentEditable.current;
    const { selectionStart, selectionEnd } = getSelection(block);
    if (selectionStart !== selectionEnd) {
      this.openActionMenu(block, "TEXT_SELECTION");
    }
  }

  tagSelectionHandler(tag) {
    if (this.state.isTyping) {
      this.setState({ tag: tag, html: this.state.htmlBackup }, () => {
        setCaretToEnd(this.contentEditable.current);
        this.closeSelectMenuHandler();
      });
    } else {
      this.setState({ ...this.state, tag: tag }, () => {
        this.closeSelectMenuHandler();
      });
    }
  }

  render() {
    // console.log("rerendering");
    return (
      <>
        {this.state.selectMenuIsOpen && (
          <SelectMenu
            position={this.state.selectMenuPosition}
            onSelect={this.tagSelectionHandler}
            close={this.closeSelectMenuHandler}
          />
        )}
        <ContentEditable
          className={styles.Block}
          innerRef={this.contentEditable}
          html={this.state.html}
          tagName={this.state.tag}
          onChange={this.onChangeHandler}
          onKeyDown={this.onKeyDownHandler}
          onKeyUp={this.onKeyUpHandler}
          data-position={this.props.position}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
        />
      </>
    );
  }
}

export default EditableBlock;

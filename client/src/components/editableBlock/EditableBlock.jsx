import React from "react";
import ContentEditable from "react-contenteditable";
import { getCaretCoordinates } from "../../helpers/getCaretCoordinates";
import { setCaretToEnd } from "../../helpers/setCaretToEnd";
import ButtonBlock from "../ButtonBlock";
import SelectMenu from "../selectMenu/SelectMenu";
import styles from "./editableBlock.module.css";

const listTags = ["unordered", "ordered"];
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
    this.handleCounterClick = this.handleCounterClick.bind(this);
    this.renderSwitch = this.renderSwitch.bind(this);
    this.wrapHtmlLi = this.wrapHtmlLi.bind(this);
    this.isListEmpty = this.isListEmpty.bind(this);
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
      counter: undefined,
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
      this.setState({
        html: this.props.html,
        tag: this.props.tag,
        counter: this.props.counter,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("in cdu of block");
    const stoppedTyping = prevState.isTyping && !this.state.isTyping;
    const hasNoPlaceholder = !this.state.placeholder;
    // берем html из пропсов, потому что нам надо сравнить html до начала печатания с html когда пользователь закончил печатать.
    const htmlChanged = this.props.html !== this.state.html;
    const tagChanged = prevState.tag !== this.state.tag;
    const buttonChanged =
      this.state.tag === "btn" && prevState.counter !== this.state.counter;

    // здесь нужно будет проверять состояние кастомных компонентов на изменения (сравнивать их с прошлыми).
    if (
      ((stoppedTyping && htmlChanged) || tagChanged || buttonChanged) &&
      hasNoPlaceholder
    ) {
      console.log("in update page");
      this.props.updatePage({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
        counter: this.state.counter,
      });
    }
  }

  onChangeHandler(e) {
    // Здесь сеттится новый html
    console.log("in on change");
    this.setState({ html: e.target.value });
  }

  handleFocus() {
    console.log("in handle focus");
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
    console.log("in handle blur");
    // Показываем placeholder, если после blur все еще единственный и пустой.
    const hasPlaceholder = this.addPlaceholder({
      block: this.contentEditable.current,
      position: this.props.position,
      content: this.state.html,
    });
    // не даем блюрить пользователю, если открыто меню выбора тэга, потому что изменится isTyping и при клике не заменится html на старый
    if (!hasPlaceholder && !this.state.selectMenuIsOpen) {
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
    if (
      e.key === "Enter" &&
      this.state.previousKey !== "Shift" &&
      this.state.previousKey !== "Control" &&
      !this.state.selectMenuIsOpen
    ) {
      console.log("Previous key " + this.state.previousKey);
      e.preventDefault();
      if (listTags.includes(this.state.tag)) {
        console.log("bulleted list");
        this.setState((prevState) => {
          return { html: prevState.html + "<li></li>" };
        });
      } else {
        this.props.addBlock({
          id: this.props.id,
          ref: this.contentEditable.current,
        });
      }
    }

    // Это будет использоваться для выхода из списков.
    if (e.key === "Enter" && this.state.previousKey === "Control") {
      console.log("forced enter");
      this.props.addBlock({
        id: this.props.id,
        ref: this.contentEditable.current,
      });
    }

    // удаляем если html empty или список пустой
    if (e.key === "Backspace" && (!this.state.html || this.isListEmpty())) {
      e.preventDefault();
      this.props.deleteBlock({
        id: this.props.id,
        ref: this.contentEditable.current,
      });
    }
    // Todo: удалить первую строку li, добавить сверху новый элемент с этой строкой, если строка не пустая
    if (e.key === "Backspace" && listTags.includes(this.state.tag)) {
      // const { x, y } = getCaretCoordinates();
      // console.log(x, y);
    }
    this.setState({ previousKey: e.key });
  }

  onKeyUpHandler(e) {
    if (e.key === "/") {
      this.openSelectMenuHandler();
    }
  }

  openSelectMenuHandler() {
    // Получаем координаты курсора в блоке
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
    console.log("in tag selectin handler");
    console.log("is Typing: " + this.state.isTyping);
    // is typing - когда мы выбираем с помощью /, остальное - мы выбираем с помощью клика (еще не имплементировано)
    // после обновления тэга нужно обнулять counter, если не происходит выбор btn
    // здесь нам нужно обернуть html в li, если мы переключаемся на li, в той функции как раз производится проверка на li, если они уже там есть, то ничего не произойдет. Просто чтобы на каждом рендере не вызывалось
    const counterValue = tag === "btn" ? 0 : undefined;
    if (this.state.isTyping) {
      this.setState(
        {
          tag: tag,
          html: this.wrapHtmlLi(this.state.htmlBackup, tag),
          counter: counterValue,
        },
        () => {
          setCaretToEnd(this.contentEditable.current);
          this.closeSelectMenuHandler();
        }
      );
    } else {
      this.setState(
        {
          ...this.state,
          tag: tag,
          counter: counterValue,
          html: this.wrapHtmlLi(this.state.html, tag),
        },
        () => {
          this.closeSelectMenuHandler();
        }
      );
    }
  }

  handleCounterClick() {
    console.log("in handle counter");
    this.setState((prevState) => {
      return {
        ...prevState,
        counter: prevState.counter + 1,
      };
    });
  }

  wrapHtmlLi(html, tag) {
    console.log("in wrap html");
    if (!listTags.includes(tag)) return html;
    return html.includes("<li>") ? html : `<li>${html}</li>`;
  }

  isListEmpty() {
    // проверка, является ли блок списковым
    if (!listTags.includes(this.state.tag)) return false;
    // Если список, то проверяем html
    console.log(this.state.html);
    // console.log(this.state.html === "<li><br></li>");
    const listEmpty =
      this.state.html === "<li><br></li>" || this.state.html === "<li></li>";
    console.log(listEmpty);
    return listEmpty;
  }

  renderSwitch(tag) {
    switch (tag) {
      case "btn":
        return (
          <div className={styles.ParentBlock}>
            <ContentEditable
              className={styles.Block}
              innerRef={this.contentEditable}
              html={this.state.html}
              tagName={"p"}
              onChange={this.onChangeHandler}
              onKeyDown={this.onKeyDownHandler}
              onKeyUp={this.onKeyUpHandler}
              data-position={this.props.position}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
            />
            <ButtonBlock
              counter={this.state.counter}
              onButtonClick={this.handleCounterClick}
            />
          </div>
        );
      case "unordered":
        return (
          <ContentEditable
            className={styles.Block}
            innerRef={this.contentEditable}
            html={this.state.html}
            tagName={"ul"}
            onChange={this.onChangeHandler}
            onKeyDown={this.onKeyDownHandler}
            onKeyUp={this.onKeyUpHandler}
            data-position={this.props.position}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
          />
        );
      case "ordered":
        return (
          <ContentEditable
            className={styles.Block}
            innerRef={this.contentEditable}
            html={this.state.html}
            tagName={"ol"}
            onChange={this.onChangeHandler}
            onKeyDown={this.onKeyDownHandler}
            onKeyUp={this.onKeyUpHandler}
            data-position={this.props.position}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
          />
        );
      default:
        return (
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
        );
    }
  }

  render() {
    return (
      <>
        {this.state.selectMenuIsOpen && (
          <SelectMenu
            position={this.state.selectMenuPosition}
            onSelect={this.tagSelectionHandler}
            close={this.closeSelectMenuHandler}
          />
        )}
        {this.renderSwitch(this.state.tag)}
      </>
    );
  }
}

export default EditableBlock;

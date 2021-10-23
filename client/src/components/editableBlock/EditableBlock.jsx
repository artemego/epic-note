import React from "react";
import { Draggable } from "react-beautiful-dnd";
import ContentEditable from "react-contenteditable";
import { getCaretCoordinates } from "../../helpers/getCaretCoordinates";
import { setCaretToEnd } from "../../helpers/setCaretToEnd";
import ActionMenu from "../actionMenu/ActionMenu";
import ButtonBlock from "../ButtonBlock";
import SelectMenu from "../selectMenu/SelectMenu";
import styles from "./editableBlock.module.scss";
import DragHandleIcon from "../../images/draggable.svg";
import ToggleList from "../ToggleList";
import TodoList from "../TodoList";

const listTags = ["unordered", "ordered", "toggle", "todolist"];
class EditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
    this.firstRender = React.createRef();
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    this.openSelectMenuHandler = this.openSelectMenuHandler.bind(this);
    this.closeSelectMenuHandler = this.closeSelectMenuHandler.bind(this);
    this.openActionMenuHanler = this.openActionMenuHanler.bind(this);
    this.closeActionMenuHandler = this.closeActionMenuHandler.bind(this);
    this.tagSelectionHandler = this.tagSelectionHandler.bind(this);
    this.addPlaceholder = this.addPlaceholder.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleCounterClick = this.handleCounterClick.bind(this);
    this.renderSwitch = this.renderSwitch.bind(this);
    this.wrapHtmlLi = this.wrapHtmlLi.bind(this);
    this.isListEmpty = this.isListEmpty.bind(this);
    this.handleDragHandleClick = this.handleDragHandleClick.bind(this);
    this.handleOverrideHtml = this.handleOverrideHtml.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this);
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
      actionMenuIsOpen: false,
      actionMenuPosition: {
        x: null,
        y: null,
      },
      isTyping: false,
      placeholder: false,
      counter: undefined,
    };
  }

  componentDidMount() {
    console.log("in did mount of block");
    this.firstRender.current = true;
    const hasPlaceholder = this.addPlaceholder({
      block: this.contentEditable.current,
      position: this.props.position,
      content: this.props.html,
    });
    if (!hasPlaceholder) {
      // initialise html and tag from props
      this.setState({
        html: this.props.html,
        tag: this.props.tag,
        counter: this.props.counter,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("in cdu of block");
    // больше не проверяем stoppedTyping, потому что подключен debounce
    // const stoppedTyping = prevState.isTyping && !this.state.isTyping;
    const hasNoPlaceholder = !this.state.placeholder;
    // берем html из пропсов, потому что нам надо сравнить html до начала печатания с html когда пользователь закончил печатать.
    const htmlChanged = this.props.html !== this.state.html;
    const tagChanged = prevState.tag !== this.state.tag;
    // чтобы предотвратить вызовы updatePage, когда мы добавляем новый блок
    const isEnterPrevious = this.state.previousKey === "Enter";
    const buttonChanged =
      this.state.tag === "btn" && prevState.counter !== this.state.counter;
    // чтобы предотвратить вызовы updatePage, когда у нас инициализируются пропсы(html и tag) при первом рендере
    const isFirstRender = this.isFirstRender();
    if (
      (htmlChanged || tagChanged || buttonChanged) &&
      hasNoPlaceholder &&
      !isEnterPrevious &&
      !isFirstRender
    ) {
      this.props.updatePage(
        {
          id: this.props.id,
          html: this.state.html,
          tag: this.state.tag,
          counter: this.state.counter,
        },
        this.props.pageId
      );
    }
  }

  forceUpdate() {
    console.log("forced update");
    this.props.updatePage({
      id: this.props.id,
      html: this.state.html,
      tag: this.state.tag,
      counter: this.state.counter,
    });
  }

  isFirstRender() {
    const firstRender = this.firstRender.current;
    this.firstRender.current = false;
    return firstRender;
  }

  onChangeHandler(e) {
    // Здесь сеттится новый html
    console.log("in on change");
    this.setState({ html: e.target.value });
  }

  handleOverrideHtml(newHtml) {
    this.setState({ html: newHtml, isTyping: false }, () => {
      this.forceUpdate();
    });
  }

  // TODO: почему-то когда у нас только два блока на странице и мы переключаемся со страницы, где первый блок - placeholder, срабатывает фокус
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
      this.setState({ isTyping: true });
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
          tag: this.state.tag,
          html: this.state.html,
        });
      }
    }

    // Это будет использоваться для выхода из списков.
    if (e.key === "Enter" && this.state.previousKey === "Control") {
      console.log("forced enter");
      this.props.addBlock({
        id: this.props.id,
        tag: this.state.tag,
        html: this.state.html,
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
      this.openSelectMenuHandler("KEY_CMD");
    }
  }

  handleDragHandleClick(e) {
    console.log("in handle drag click");
    const dragHandle = e.target;
    this.openActionMenuHanler(dragHandle, "DRAG_HANDLE_CLICK");
  }

  openSelectMenuHandler(trigger) {
    const { x, y } = this.calculateSelectMenuPosition(trigger);
    // console.log(x, y);
    this.setState({
      ...this.state,
      selectMenuPosition: { x: x, y: y },
      selectMenuIsOpen: true,
    });
    // document.addEventListener("click", this.closeSelectMenuHandler, false);
    setTimeout(() => {
      document.addEventListener("click", this.closeSelectMenuHandler, false);
    }, 100);
  }

  closeSelectMenuHandler() {
    console.log("closing select menu");
    this.setState({
      htmlBackup: null,
      selectMenuIsOpen: false,
      selectMenuPosition: { x: null, y: null },
    });
    document.removeEventListener("click", this.closeSelectMenuHandler, false);
  }

  openActionMenuHanler(parent, trigger) {
    const { x, y } = this.calculateActionMenuPosition(parent, trigger);
    console.log(x, y);

    this.setState({
      ...this.state,
      actionMenuPosition: { x: x, y: y },
      actionMenuIsOpen: true,
    });

    setTimeout(() => {
      document.addEventListener("click", this.closeActionMenuHandler, false);
    }, 100);
  }

  closeActionMenuHandler() {
    this.setState({
      ...this.state,
      actionMenuPosition: { x: null, y: null },
      actionMenuIsOpen: false,
    });
    document.removeEventListener("click", this.closeActionMenuHandler, false);
  }

  calculateActionMenuPosition(parent, initiator) {
    console.log(parent, initiator);
    switch (initiator) {
      case "DRAG_HANDLE_CLICK":
        const x =
          parent.offsetLeft - parent.scrollLeft + parent.clientLeft - 90;
        const y = parent.offsetTop - parent.scrollTop + parent.clientTop + 35;
        console.log(x, y);
        return { x: x, y: y };
      default:
        return { x: null, y: null };
    }
  }

  calculateSelectMenuPosition(initiator) {
    switch (initiator) {
      case "KEY_CMD":
        const { x: caretLeft, y: caretTop } = getCaretCoordinates(true);
        return { x: caretLeft, y: caretTop };
      case "ACTION_MENU":
        console.log("calculating action menu position");
        const { x: actionX, y: actionY } = this.state.actionMenuPosition;
        return { x: actionX - 40, y: actionY };
      default:
        return { x: null, y: null };
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
          if (tag !== "toggle") setCaretToEnd(this.contentEditable.current);
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

  renderSwitch(tag, isDragging) {
    const blockClasses = [
      styles.Block,
      this.state.isTyping || this.state.selectMenuIsOpen
        ? styles.BlockSelected
        : null,
      isDragging ? styles.isDragging : null,
    ].join(" ");
    switch (tag) {
      case "btn":
        return (
          <div className={styles.ParentBlock}>
            <ContentEditable
              className={blockClasses}
              innerRef={this.contentEditable}
              html={this.state.html}
              tagName={"p"}
              onChange={this.onChangeHandler}
              onKeyDown={this.onKeyDownHandler}
              onKeyUp={this.onKeyUpHandler}
              data-position={this.props.position}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              key={this.props.position}
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
            className={blockClasses}
            innerRef={this.contentEditable}
            html={this.state.html}
            tagName={"ul"}
            onChange={this.onChangeHandler}
            onKeyDown={this.onKeyDownHandler}
            onKeyUp={this.onKeyUpHandler}
            data-position={this.props.position}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            key={this.props.position}
          />
        );
      case "ordered":
        return (
          <ContentEditable
            className={blockClasses}
            innerRef={this.contentEditable}
            html={this.state.html}
            tagName={"ol"}
            onChange={this.onChangeHandler}
            onKeyDown={this.onKeyDownHandler}
            onKeyUp={this.onKeyUpHandler}
            data-position={this.props.position}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            key={this.props.position}
          />
        );
      case "toggle":
        return (
          <ToggleList html={this.state.html}>
            <ContentEditable
              className={blockClasses}
              innerRef={this.contentEditable}
              html={this.state.html}
              tagName={"ul"}
              onChange={this.onChangeHandler}
              onKeyDown={this.onKeyDownHandler}
              onKeyUp={this.onKeyUpHandler}
              data-position={this.props.position}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              key={this.props.position}
            />
          </ToggleList>
        );
      case "todolist":
        return (
          <TodoList
            html={this.state.html}
            overrideHtml={this.handleOverrideHtml}
          >
            <ContentEditable
              className={blockClasses}
              innerRef={this.contentEditable}
              html={this.state.html}
              tagName={"ul"}
              onChange={this.onChangeHandler}
              onKeyDown={this.onKeyDownHandler}
              onKeyUp={this.onKeyUpHandler}
              data-position={this.props.position}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              key={this.props.position}
            />
          </TodoList>
        );
      default:
        return (
          <>
            <ContentEditable
              className={blockClasses}
              innerRef={this.contentEditable}
              html={this.state.html}
              tagName={this.state.tag}
              onChange={this.onChangeHandler}
              onKeyDown={this.onKeyDownHandler}
              onKeyUp={this.onKeyUpHandler}
              data-position={this.props.position}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              key={this.props.position}
            />
          </>
        );
    }
  }

  render() {
    return (
      <>
        {console.log("RERENDERING BLOCK")}
        {this.state.selectMenuIsOpen && (
          <SelectMenu
            position={this.state.selectMenuPosition}
            onSelect={this.tagSelectionHandler}
            close={this.closeSelectMenuHandler}
          />
        )}
        {this.state.actionMenuIsOpen && (
          <ActionMenu
            position={this.state.actionMenuPosition}
            actions={{
              deleteBlock: () => this.props.deleteBlock({ id: this.props.id }),
              turnInto: () => this.openSelectMenuHandler("ACTION_MENU"),
            }}
          />
        )}

        <Draggable draggableId={this.props.id} index={this.props.position}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.draggableProps}>
              <div className={styles.draggable}>
                {this.renderSwitch(this.state.tag, snapshot.isDragging)}
                <span
                  role="button"
                  tabIndex="0"
                  className={styles.dragHandle}
                  onClick={this.handleDragHandleClick}
                  {...provided.dragHandleProps}
                >
                  <img src={DragHandleIcon} alt="Icon" />
                </span>
              </div>
            </div>
          )}
        </Draggable>
      </>
    );
  }
}

export default React.memo(EditableBlock);

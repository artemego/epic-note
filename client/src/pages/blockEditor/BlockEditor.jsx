import React from "react";
import styles from "./blockEditor.module.css";
import { generate } from "shortid";
import EditableBlock from "../../components/editableBlock/EditableBlock";
import { setCaretToEnd } from "../../helpers/setCaretToEnd";

const blockInfo = [
  {
    id: generate(),
    html: "",
    tag: "h1",
  },
  {
    id: generate(),
    html: "",
    tag: "h2",
  },
  {
    id: generate(),
    html: "",
    tag: "p",
  },
];

class BlockEditor extends React.Component {
  constructor(props) {
    super(props);
    this.updatePageHandler = this.updatePageHandler.bind(this);
    this.addBlockHandler = this.addBlockHandler.bind(this);
    this.deleteBlockHandler = this.deleteBlockHandler.bind(this);
    this.state = { blocks: [...blockInfo] };
  }

  updatePageHandler(updatedBlock) {
    console.log("update page handler");
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    // сначала копируем свойства старого элемента, затем изменяем на новые
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    this.setState({ blocks: updatedBlocks });
  }

  addBlockHandler(currentBlock) {
    const newBlock = { id: generate(), html: "", tag: "p" };
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    this.setState({ blocks: updatedBlocks }, () => {
      currentBlock.ref.nextElementSibling.focus();
    });
  }

  deleteBlockHandler(currentBlock) {
    const previousBlock = currentBlock.ref.previousElementSibling;
    if (previousBlock) {
      const blocks = this.state.blocks;
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      this.setState({ blocks: updatedBlocks }, () => {
        setCaretToEnd(previousBlock);
        previousBlock.focus();
      });
    }
  }

  render() {
    return (
      <div className={styles.editor}>
        {this.state.blocks.map((block) => {
          return (
            <EditableBlock
              key={block.id}
              id={block.id}
              tag={block.tag}
              html={block.html}
              updatePage={this.updatePageHandler}
              addBlock={this.addBlockHandler}
              deleteBlock={this.deleteBlockHandler}
            />
          );
        })}
      </div>
    );
  }
}

export default BlockEditor;

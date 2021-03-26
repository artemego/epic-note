import React, { useEffect, useState } from "react";
// @ts-ignore
import styles from "./blockEditor.module.css";
import { generate } from "shortid";
import EditableBlock from "../../components/editableBlock/EditableBlock";
import { setCaretToEnd } from "../../helpers/setCaretToEnd";
import usePrevious from "../../hooks/usePrevious";

const BlockEditor = ({ fetchedBlocks }) => {
  const [blocks, setBlocks] = useState(fetchedBlocks);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const prevBlocks = usePrevious(blocks);

  useEffect(() => {
    console.log("new fetched blocks");
    setBlocks(fetchedBlocks);
    setCurrentBlockId(null);
  }, [fetchedBlocks]);

  const updatePageOnServer = async (blocks) => {
    // console.log(blocks);
  };

  useEffect(() => {
    if (prevBlocks && prevBlocks !== blocks) {
      updatePageOnServer(blocks);
    }
  }, [blocks, prevBlocks]);

  // Handling the cursor and focus on adding and deleting blocks
  useEffect(() => {
    // If a new block was added, move the caret to it
    if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
      const nextBlockPosition =
        blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
      const nextBlock = document.querySelector(
        `[data-position="${nextBlockPosition}"]`
      );
      if (nextBlock) {
        nextBlock.focus();
      }
    }
    // If a block was deleted, move the caret to the end of the last block
    if (prevBlocks && prevBlocks.length - 1 === blocks.length) {
      const lastBlockPosition = prevBlocks
        .map((b) => b._id)
        .indexOf(currentBlockId);
      const lastBlock = document.querySelector(
        `[data-position="${lastBlockPosition}"]`
      );
      if (lastBlock) {
        setCaretToEnd(lastBlock);
      }
    }
  }, [blocks, prevBlocks, currentBlockId]);

  const updateBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const oldBlock = blocks[index];
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    setCurrentBlockId(currentBlock.id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    // console.log(index);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: generate(), tag: "p", html: "" };
    updatedBlocks.splice(index + 1, 0, newBlock);
    // console.log("Updated blocks: " + updatedBlocks);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    if (blocks.length > 1) {
      setCurrentBlockId(currentBlock.id);
      const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
      const deletedBlock = blocks[index];
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
    }
  };

  return (
    <div className={styles.editor}>
      {blocks.map((block) => {
        const position = blocks.map((b) => b._id).indexOf(block._id) + 1;
        return (
          <EditableBlock
            key={block._id}
            position={position}
            id={block._id}
            tag={block.tag}
            html={block.html}
            // pageId={id}
            addBlock={addBlockHandler}
            deleteBlock={deleteBlockHandler}
            updatePage={updateBlockHandler}
          />
        );
      })}
    </div>
  );
};

export default BlockEditor;

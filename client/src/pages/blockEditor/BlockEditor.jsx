import React, { useEffect, useState } from "react";
// @ts-ignore
import styles from "./blockEditor.module.css";
import EditableBlock from "../../components/editableBlock/EditableBlock";
import { setCaretToEnd } from "../../helpers/setCaretToEnd";
import usePrevious from "../../hooks/usePrevious";
import * as notesApi from "../../api/notesApi";
import objectId from "../../helpers/objectId";

// let fetchedBlocks = [
//   { _id: "6087ed090517ef6d77274b74", tag: "h1", html: "page titleаываыва" },
//   { _id: "6087ed168de4d5b90415f8de", tag: "p", html: "new page content" },
//   { _id: "60882c33ee7a6ee4afa4dfff", tag: "p", html: "qweqe" },
//   { _id: "6089a8b24cf813dc609ad6d0", tag: "p", html: "qweqewq" },
//   {
//     _id: "6089a8f4d40ee50267ccab1e",
//     tag: "unordered",
//     html: "hello",
//   },
// ];

const BlockEditor = ({ pageId, accessToken, fetchedBlocks }) => {
  const [blocks, setBlocks] = useState(fetchedBlocks);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const prevBlocks = usePrevious(blocks);

  useEffect(() => {
    console.log("new fetched blocks");
    if (fetchedBlocks.length === 0) console.log("array length is 0");
    setBlocks(fetchedBlocks);
    setCurrentBlockId(null);
    // console.log(fetchedBlocks);
  }, [fetchedBlocks]);

  const updatePageOnServer = async (blocks) => {
    // console.log("UPDATING SERVER WITH BLOCKS: " + JSON.stringify(blocks));
    notesApi.updatePage(accessToken, pageId, blocks);
  };

  useEffect(() => {
    if (prevBlocks && prevBlocks !== blocks) {
      updatePageOnServer({ blocks: blocks });
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

  // Здесь мы обновляем общий стейт с блоками, а это в свою очередь триггерит useEffect на blocks и prevBlocks, в этом юз эффекте нам и нужно посылать запросы с обновлениями на сервер.
  const updateBlockHandler = (currentBlock) => {
    // console.log("In update block handler");
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const oldBlock = blocks[index];
    const updatedBlocks = [...blocks];

    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      counter: currentBlock.counter,
    };
    setBlocks(updatedBlocks);
  };

  // Вот здесь какая-то муть
  const addBlockHandler = (currentBlock) => {
    // console.log(currentBlock);
    setCurrentBlockId(currentBlock.id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    // console.log(index);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: objectId(), tag: "p", html: "" };
    updatedBlocks.splice(index + 1, 0, newBlock);
    // console.log("Updated blocks: " + updatedBlocks);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
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
            addBlock={addBlockHandler}
            deleteBlock={deleteBlockHandler}
            updatePage={updateBlockHandler}
            counter={block.counter}
          />
        );
      })}
    </div>
  );
};

export default BlockEditor;

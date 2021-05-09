import React, { useEffect, useState } from "react";
// @ts-ignore
import styles from "./blockEditor.module.css";
import EditableBlock from "../../components/editableBlock/EditableBlock";
import { setCaretToEnd } from "../../helpers/setCaretToEnd";
import usePrevious from "../../hooks/usePrevious";
import * as notesApi from "../../api/notesApi";
import objectId from "../../helpers/objectId";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

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

  const onDragEndHandler = (result) => {
    const { destination, source } = result;

    // If we don't have a destination (due to dropping outside the droppable)
    // or the destination hasn't changed, we change nothing
    if (!destination || destination.index === source.index) {
      return;
    }

    const updatedBlocks = [...blocks];
    const removedBlocks = updatedBlocks.splice(source.index - 1, 1);
    updatedBlocks.splice(destination.index - 1, 0, removedBlocks[0]);
    setBlocks(updatedBlocks);
    console.log(destination, source);
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <div className={styles.editor}>
        <Droppable droppableId={pageId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.droppable}
            >
              {blocks.map((block) => {
                const position =
                  blocks.map((b) => b._id).indexOf(block._id) + 1;
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default BlockEditor;

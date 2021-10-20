import React, { useEffect, useState } from "react";
// @ts-ignore
import styles from "./blockEditor.module.scss";
import EditableBlock from "../../components/editableBlock/EditableBlock";
import { setCaretToEnd } from "../../helpers/setCaretToEnd";
import usePrevious from "../../hooks/usePrevious";
import * as notesApi from "../../api/notesApi";
import objectId from "../../helpers/objectId";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useCallback } from "react";
import { useRef } from "react";

const BlockEditor = ({ pageId, accessToken, fetchedBlocks }) => {
  const [blocks, setBlocks] = useState(fetchedBlocks);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const prevBlocks = usePrevious(blocks);
  // используется, чтобы предотвратить отправку новых блоков на сервер, когда мы меняем страницу.
  // ресетается обратно на true, когда сменяется страница (приходят новые fetchedBlocks)
  // присваивается значение false, когда происходит какое-то действие с блоками
  const isFirstRenderWithPage = useRef(true);

  useEffect(() => {
    if (fetchedBlocks.length === 0) console.log("array length is 0");
    setBlocks(fetchedBlocks);
    setCurrentBlockId(null);
    isFirstRenderWithPage.current = true;
  }, [fetchedBlocks]);

  const updatePageOnServer = async (blocks) => {
    notesApi.updatePage(accessToken, pageId, blocks);
  };

  useEffect(() => {
    if (!isFirstRenderWithPage.current && prevBlocks && prevBlocks !== blocks) {
      console.log(
        "UPDATING SERVER WITH BLOCKS: ",
        blocks,
        isFirstRenderWithPage.current
      );
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
        console.log("IN LAST BLOCK");
        setCaretToEnd(lastBlock);
      }
    }
  }, [blocks, prevBlocks, currentBlockId]);

  // Здесь мы обновляем общий стейт с блоками, а это в свою очередь триггерит useEffect на blocks и prevBlocks, в этом юз эффекте нам и нужно посылать запросы с обновлениями на сервер.
  const updateBlockHandler = useCallback(
    (currentBlock) => {
      console.log("in update block handler");
      isFirstRenderWithPage.current = false;
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
    },
    [blocks]
  );

  const addBlockHandler = useCallback(
    (currentBlock) => {
      isFirstRenderWithPage.current = false;
      setCurrentBlockId(currentBlock.id);
      const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      const newBlock = { _id: objectId(), tag: "p", html: "" };
      updatedBlocks.splice(index + 1, 0, newBlock);
      // это на тот случай, когда у нас еще не произошло обновление текущего блока через updateBlock (когда пользователь не закончил печатать и нажал enter)
      updatedBlocks[index] = {
        ...updatedBlocks[index],
        tag: currentBlock.tag,
        html: currentBlock.html,
      };
      setBlocks(updatedBlocks);
    },
    [blocks]
  );

  const deleteBlockHandler = useCallback(
    (currentBlock) => {
      isFirstRenderWithPage.current = false;
      if (blocks.length > 1) {
        setCurrentBlockId(currentBlock.id);
        const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
        const deletedBlock = blocks[index];
        const updatedBlocks = [...blocks];
        updatedBlocks.splice(index, 1);
        setBlocks(updatedBlocks);
      }
    },
    [blocks]
  );

  const onDragEndHandler = useCallback(
    (result) => {
      isFirstRenderWithPage.current = false;
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
    },
    [blocks]
  );

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

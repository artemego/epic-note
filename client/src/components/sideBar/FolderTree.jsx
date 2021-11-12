import React, { useEffect, useState } from "react";
import Tree, { mutateTree, moveItemOnTree } from "@atlaskit/tree";
import { IconButton } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon, MinusIcon } from "@chakra-ui/icons";
import PageItem from "./PageItem";

function FolderTree({
  handlePageClick,
  handlePageDelete,
  pageId,
  isDeleting,
  deletingId,
  pagesData,
  handleUpdatePages,
}) {
  const [tree, setTree] = useState(demoData);

  useEffect(() => {
    if (!pagesData) setTree(demoData);
    else setTree(makeTreeObj(pagesData));
  }, [pagesData]);

  const updateIfTreeChanged = (updatedTree) => {
    // console.log("update server with tree: ", updatedTree);
    handleUpdatePages(updatedTree);
  };

  const getIcon = (item) => {
    if (item.children && item.children.length > 0) {
      return item.isExpanded ? (
        <IconButton icon={<ChevronDownIcon />} colorScheme="orange" size="xs" />
      ) : (
        <IconButton
          icon={<ChevronRightIcon />}
          colorScheme="orange"
          size="xs"
        />
      );
    }
    return (
      <IconButton
        icon={<MinusIcon />}
        colorScheme="orange"
        size="xs"
        display="none"
      />
    );
  };

  // это мы будем делать только при первоначальном рендере, добавлении и удалении страницы, при обновлении порядка страниц у нас уже будет правильная структура дерева
  const makeTreeObj = ({ pageItems, rootIds }) => {
    const rootItem = {
      id: "1",
      children: rootIds,
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: "root",
      },
    };

    const initialObj = {
      1: rootItem,
    };

    const itemsObj = pageItems.reduce((obj, item) => {
      return { ...obj, [item.id]: item };
    }, initialObj);

    return {
      rootId: "1",
      items: itemsObj,
    };
  };

  const onExpand = (itemId) => {
    const updatedTree = mutateTree(tree, itemId, { isExpanded: true });
    updateIfTreeChanged(updatedTree);
    setTree(updatedTree);
  };

  const onCollapse = (itemId) => {
    const updatedTree = mutateTree(tree, itemId, { isExpanded: false });
    updateIfTreeChanged(updatedTree);
    setTree(updatedTree);
  };

  const onDragEnd = (source, destination) => {
    if (!destination) return;
    const updatedTree = moveItemOnTree(tree, source, destination);

    updateIfTreeChanged(updatedTree);
    setTree(updatedTree);
  };

  const renderItem = ({ item, onExpand, onCollapse, provided }) => {
    const { style: draggableStyle, ...restDraggableProps } =
      provided.draggableProps;
    const hasChildren = item.children && item.children.length > 0;
    return (
      <div
        ref={provided.innerRef}
        {...restDraggableProps}
        style={{ ...draggableStyle, ...styles.draggable }}
        {...provided.dragHandleProps}
      >
        <div
          style={{
            paddingLeft: draggableStyle.paddingLeft,
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span
            style={styles.icon}
            onClick={(event) => {
              event.preventDefault();
              if (hasChildren) {
                if (item.isExpanded) onCollapse(item.id);
                else onExpand(item.id);
              }
            }}
          >
            {getIcon(item)}
          </span>

          <PageItem
            handlePageClick={handlePageClick}
            handlePageDelete={handlePageDelete}
            page={{ pageId: item.id, name: item.data.title }}
            pageId={pageId}
            isDeleting={isDeleting}
            deletingId={deletingId}
          />
        </div>
        {provided.placeholder}
      </div>
    );
  };

  return (
    <div style={styles.root}>
      <Tree
        tree={tree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        offsetPerLevel={8}
        isDragEnabled
        isNestingEnabled
      />
    </div>
  );
}

const styles = {
  root: {
    width: "100%",
  },
  draggable: {
    backgroundColor: "#edebe8",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
    margin: "5px 5px",
  },
  icon: {
    display: "inline-block",
    justifyContent: "center",
    width: 16,
    userSelect: "none",
  },
};

const demoData = {
  rootId: "1",
  items: {},
};

export default React.memo(FolderTree);

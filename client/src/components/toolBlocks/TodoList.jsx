import { Checkbox } from "@chakra-ui/checkbox";
import { Flex, Stack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useRef } from "react";

import usePrevious from "../../hooks/usePrevious";

function TodoList({ children, html, overrideHtml }) {
  const isFirstRender = useRef(true);
  const [liChecked, setLiChecked] = useState([]);
  const liCount = isFirstRender
    ? 0
    : children.props.innerRef.current.childElementCount;
  const prevLiCount = usePrevious(liCount);

  useEffect(() => {
    setLiChecked(getLiCheckedArrayFromHtml(html));
  }, []);

  // когда мы только переключаемся с закрытого тудулиста, innerRef у нас будет null
  // поэтому на первом рендере мы будем делать вычисление liChecked с помощью html, а не из props.innerRef
  useEffect(() => {
    if (isFirstRender) {
      const currentCount = children.props.innerRef.current.childElementCount;
      if (prevLiCount !== currentCount) {
        setLiChecked(getLiCheckedArray(html));
      }
    }
    isFirstRender.current = false;
  }, [html]);

  const getLiCheckedArray = () => {
    const liElemsArray = [...children.props.innerRef.current.children];
    // проверяем их на <s> тэг
    return liElemsArray.map((elem) => {
      return /<s>/.test(elem.innerHTML) ? true : false;
    });
  };

  const getLiCheckedArrayFromHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const liElems = doc.getElementsByTagName("li");
    const liElemsArray = [...liElems];
    return liElemsArray.map((elem) => {
      return /<s>/.test(elem.innerHTML) ? true : false;
    });
  };

  const handleLiClick = (index) => {
    // меняем значение элемента в массиве
    const newArr = [...liChecked];
    newArr[index] = !newArr[index];
    setLiChecked(newArr);
    changeHtml(index, newArr[index]);
  };

  const changeHtml = (index, completed) => {
    const liArray = [...children.props.innerRef.current.children];

    const changedHtmlNew = completed
      ? `<s>${liArray[index].innerText}</s>`
      : liArray[index].innerText;

    liArray[index].innerHTML = changedHtmlNew;

    const newLiArrayHtml = liArray.map((el) => el.outerHTML);
    overrideHtml(newLiArrayHtml.join(""));
  };

  return (
    <Flex w="100%" alignItems="center">
      <Stack
        direction="column"
        m="0 5px"
        alignSelf="stretch"
        justifyContent="center"
      >
        {liChecked.map((el, idx) => {
          return (
            <Checkbox
              key={idx}
              isChecked={el}
              colorScheme="orange"
              onChange={() => {
                handleLiClick(idx);
              }}
            />
          );
        })}
      </Stack>
      {children}
    </Flex>
  );
}

const TodoListMemo = React.memo(TodoList);
export default TodoListMemo;

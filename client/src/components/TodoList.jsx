import { Checkbox } from "@chakra-ui/checkbox";
import { Flex, Stack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";

export default function TodoList({ children, html, overrideHtml }) {
  const [liChecked, setLiChecked] = useState([]);

  useEffect(() => {
    console.log(getLiCheckedArray(html));
    setLiChecked(getLiCheckedArray(html));
  }, [html]);

  // это лучше вызывать, когда количество элементов html меняется или меняется liChecked
  const getLiCheckedArray = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const liElems = doc.getElementsByTagName("li");
    const liElemsArray = [...liElems];
    return liElemsArray.map((elem) => {
      return /<s>/.test(elem.innerHTML) ? true : false;
    });
  };

  const handleLiClick = (index) => {
    console.log(index);
    // меняем значение элемента в массиве
    const newArr = [...liChecked];
    newArr[index] = !newArr[index];
    // console.log(newArr);
    setLiChecked(newArr);
    changeHtml(index, newArr[index]);
  };

  const changeHtml = (index, completed) => {
    // console.log(completed);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    console.log(index);
    const nth = doc.getElementsByTagName("li")[index];
    // если есть тэг s, то удаляем его. Если нет, то добавляем
    // console.log(nth.innerText);
    const changedHtml = completed ? `<s>${nth.innerText}</s>` : nth.innerText;
    nth.innerHTML = changedHtml;
    // console.log("changed html: " + doc.body.innerHTML);
    overrideHtml(doc.body.innerHTML);
  };

  return (
    <Flex w="100%" alignItems="center">
      {children}
      <Stack direction="column" m="0 5px">
        {liChecked.map((el, idx) => {
          return (
            <Checkbox
              isChecked={el}
              colorScheme="orange"
              onChange={() => {
                handleLiClick(idx);
              }}
            />
          );
        })}
      </Stack>
    </Flex>
  );
}

import React from "react";
import SideBar from "../components/SideBar";
import BlockEditor from "./blockEditor/BlockEditor";

// здесь у нас будет BlockEditor и сайдбар к нему.

// Todo: получать страницы и записки из базы данных

export default function Notes() {
  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <BlockEditor />
    </div>
  );
}

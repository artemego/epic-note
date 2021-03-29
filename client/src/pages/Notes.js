import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import SideBar from "../components/SideBar";
import { useAuth } from "../context/AuthContext";
import BlockEditor from "./blockEditor/BlockEditor";
import * as notesApi from "../api/notesApi";
import { generate } from "shortid";

export default function Notes() {
  const { accessToken } = useAuth().state;
  const { pageId } = useParams();

  const [fetchedBlocks, setfetchedBlocks] = useState([
    {
      html: "Blank note",
      tag: "h1",
      _id: generate(),
    },
  ]);

  // get blocks for pageId (get new blocks when pageId changes)
  useEffect(() => {
    console.log("Getting new page");
    notesApi.getPage(accessToken, pageId).then((res) => {
      // console.log(res.page);
      setfetchedBlocks(res.page.blocks);
    });
  }, [accessToken, pageId]);

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <BlockEditor
        fetchedBlocks={fetchedBlocks}
        pageId={pageId}
        accessToken={accessToken}
      />
    </div>
  );
}

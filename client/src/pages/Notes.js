import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import SideBar from "../components/SideBar";
import { useAuth } from "../context/AuthContext";
import BlockEditor from "./blockEditor/BlockEditor";
import * as notesApi from "../api/notesApi";
import { generate } from "shortid";
import Placeholder from "../components/Placeholder";

export default function Notes() {
  const { accessToken } = useAuth().state;
  const { pageId } = useParams();
  const history = useHistory();

  const [fetchedBlocks, setfetchedBlocks] = useState([
    {
      html: "",
      tag: "h1",
      _id: generate(),
    },
  ]);
  const [isBlank, setIsBlank] = useState(true);

  // при первом рендере сбрасываем маршрут, который остался из publicApp
  useEffect(() => {
    history.push("/");
  }, []);

  // get blocks for pageId (get new blocks when pageId changes)
  useEffect(() => {
    console.log("Getting new page");
    console.log(pageId);
    if (!pageId || pageId === "login") {
      setIsBlank(true);
    } else {
      setIsBlank(false);
      notesApi.getPage(accessToken, pageId).then((res) => {
        console.log(res.page);
        setfetchedBlocks(res.page.blocks);
      });
    }
  }, [accessToken, pageId]);

  return (
    <div style={{ display: "flex" }}>
      <SideBar pageId={pageId} />
      {isBlank ? (
        <Placeholder />
      ) : (
        <BlockEditor
          fetchedBlocks={fetchedBlocks}
          pageId={pageId}
          accessToken={accessToken}
        />
      )}
    </div>
  );
}

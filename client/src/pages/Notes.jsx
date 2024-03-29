import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import SideBar from "../components/sideBar/SideBar";
import { useAuth } from "../context/AuthContext";
import BlockEditor from "./blockEditor/BlockEditor";
import * as notesApi from "../api/notesApi";
import { generate } from "shortid";
import Placeholder from "../components/common/Placeholder";

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
  const [isPageLoading, setIsPageLoading] = useState(true);

  // при первом рендере сбрасываем маршрут, который остался из publicApp
  useEffect(() => {
    history.push("/");
  }, []);

  // get blocks for pageId (get new blocks when pageId changes)
  useEffect(() => {
    setIsPageLoading(true);
    // console.log("page id: ", pageId);
    if (!pageId || pageId === "login" || pageId === "register") {
      setIsBlank(true);
    } else {
      setIsBlank(false);
      notesApi.getPage(accessToken, pageId).then((res) => {
        setfetchedBlocks(res.page.blocks);
        setIsPageLoading(false);
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
          isPageLoading={isPageLoading}
        />
      )}
    </div>
  );
}

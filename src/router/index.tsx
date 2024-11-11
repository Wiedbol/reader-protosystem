import React, { useEffect } from "react";
import { Route, HashRouter, Routes } from "react-router-dom";
import Manager from "../pages/manager";
import HtmlReader from "../pages/htmlReader";
import PDFReader from "../pages/pdfReader";
import _Redirect from "../pages/redirect";

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Manager />} path="/manager" />
        <Route element={<HtmlReader />} path="/epub" />
        <Route element={<HtmlReader />} path="/mobi" />
        <Route element={<HtmlReader />} path="/cbr" />
        <Route element={<HtmlReader />} path="/cbt" />
        <Route element={<HtmlReader />} path="/cbz" />
        <Route element={<HtmlReader />} path="/cb7" />
        <Route element={<HtmlReader />} path="/azw3" />
        <Route element={<HtmlReader />} path="/azw" />
        <Route element={<HtmlReader />} path="/txt" />
        <Route element={<HtmlReader />} path="/docx" />
        <Route element={<HtmlReader />} path="/md" />
        <Route element={<HtmlReader />} path="/fb2" />
        <Route element={<HtmlReader />} path="/html" />
        <Route element={<HtmlReader />} path="/htm" />
        <Route element={<HtmlReader />} path="/xml" />
        <Route element={<HtmlReader />} path="/xhtml" />
        <Route element={<HtmlReader />} path="/mhtml" />
        <Route element={<HtmlReader />} path="/href" />
        <Route element={PDFReader} path="/pdf" />
        <Route element={_Redirect} path="/" />
      </Routes>
    </HashRouter>
  );
};

export default Router;

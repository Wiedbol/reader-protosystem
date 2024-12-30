import StorageUtil from "../serviceUtils/storageUtil";
import { isElectron } from "react-device-detect";

import BookModel from "../../models/Book";
import toast from "react-hot-toast";
import { getPDFMetadata } from "./pdfUtil";
import { copyArrayBuffer } from "../commonUtil";
import iconv from "iconv-lite";
import { Buffer } from "buffer";
declare var window: any;

class BookUtil {
  static addBook(key: string, buffer: ArrayBuffer) {
    if (isElectron) {
      const fs = window.require("fs");
      const path = window.require("path");
      const dataPath = localStorage.getItem("storageLocation")
        ? localStorage.getItem("storageLocation")
        : window
            .require("electron")
            .ipcRenderer.sendSync("storage-location", "ping");
      return new Promise<void>((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(new Blob([buffer]));
        reader.onload = async (event) => {
          if (!event.target) return;
          try {
            if (!fs.existsSync(path.join(dataPath, "book"))) {
              fs.mkdirSync(path.join(dataPath, "book"));
            }
            fs.writeFileSync(
              path.join(dataPath, "book", key),
              Buffer.from(event.target.result as any)
            );
            resolve();
          } catch (error) {
            reject();
            throw error;
          }
        };
        reader.onerror = () => {
          reject();
        };
      });
    } else {
      return window.localforage.setItem(key, buffer);
    }
  }
  static deleteBook(key: string) {
    if (isElectron) {
      const fs_extra = window.require("fs-extra");
      const path = window.require("path");
      const dataPath = localStorage.getItem("storageLocation")
        ? localStorage.getItem("storageLocation")
        : window
            .require("electron")
            .ipcRenderer.sendSync("storage-location", "ping");
      return new Promise<void>((resolve, reject) => {
        try {
          fs_extra.remove(path.join(dataPath, `book`, key), (err) => {
            if (err) throw err;
            resolve();
          });
        } catch (e) {
          reject();
        }
      });
    } else {
      return window.localforage.removeItem(key);
    }
  }
  static isBookExist(key: string, bookPath: string = "") {
    return new Promise<boolean>((resolve, reject) => {
      if (isElectron) {
        var fs = window.require("fs");
        var path = window.require("path");
        let _bookPath = path.join(
          localStorage.getItem("storageLocation")
            ? localStorage.getItem("storageLocation")
            : window
                .require("electron")
                .ipcRenderer.sendSync("storage-location", "ping"),
          `book`,
          key
        );

        if (key.startsWith("cache")) {
          resolve(fs.existsSync(_bookPath));
        } else if (
          (bookPath && fs.existsSync(bookPath)) ||
          fs.existsSync(_bookPath)
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        window.localforage.getItem(key).then((result) => {
          if (result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }
    });
  }
  static fetchBook(
    key: string,
    isArrayBuffer: boolean = false,
    bookPath: string = ""
  ) {
    if (isElectron) {
      return new Promise<File | ArrayBuffer | boolean>((resolve, reject) => {
        var fs = window.require("fs");
        var path = window.require("path");
        let _bookPath = path.join(
          localStorage.getItem("storageLocation")
            ? localStorage.getItem("storageLocation")
            : window
                .require("electron")
                .ipcRenderer.sendSync("storage-location", "ping"),
          `book`,
          key
        );
        var data;
        if (fs.existsSync(_bookPath)) {
          data = fs.readFileSync(_bookPath);
        } else if (bookPath && fs.existsSync(bookPath)) {
          data = fs.readFileSync(bookPath);
        } else {
          resolve(false);
        }

        let blobTemp = new Blob([data]);
        let fileTemp = new File([blobTemp], "data", {
          lastModified: new Date().getTime(),
          type: blobTemp.type,
        });
        if (isArrayBuffer) {
          resolve(new Uint8Array(data).buffer);
        } else {
          resolve(fileTemp);
        }
      });
    } else {
      return window.localforage.getItem(key);
    }
  }
  static FetchAllBooks(Books: BookModel[]) {
    return Books.map((item) => {
      return this.fetchBook(item.key, true, item.path);
    });
  }
  static async RedirectBook(
    book: BookModel,
    t: (string) => string,
    history: any
  ) {
    if (!(await this.isBookExist(book.key, book.path))) {
      toast.error(t("Book not exist"));
      return;
    }
    let ref = book.format.toLowerCase();

    if (isElectron) {
      if (StorageUtil.getReaderConfig("isOpenInMain") === "yes") {
        window.require("electron").ipcRenderer.invoke("new-tab", {
          url: `${window.location.href.split("#")[0]}#/${ref}/${
            book.key
          }?title=${book.name}&file=${book.key}`,
        });
      } else {
        const { ipcRenderer } = window.require("electron");
        ipcRenderer.invoke("open-book", {
          url: `${window.location.href.split("#")[0]}#/${ref}/${
            book.key
          }?title=${book.name}&file=${book.key}`,
          isMergeWord:
            book.format === "PDF"
              ? "no"
              : StorageUtil.getReaderConfig("isMergeWord"),
          isAutoFullscreen: StorageUtil.getReaderConfig("isAutoFullscreen"),
          isPreventSleep: StorageUtil.getReaderConfig("isPreventSleep"),
        });
      }
    } else {
      window.open(
        `${window.location.href.split("#")[0]}#/${ref}/${book.key}?title=${
          book.name
        }&file=${book.key}`
      );
    }
  }
  static getBookUrl(book: BookModel) {
    let ref = book.format.toLowerCase();
    return `/${ref}/${book.key}`;
  }
  static getPDFUrl(book: BookModel) {
    if (isElectron) {
      const path = window.require("path");
      const { ipcRenderer } = window.require("electron");
      localStorage.setItem("pdfPath", book.path);
      const __dirname = ipcRenderer.sendSync("get-dirname", "ping");
      let pdfLocation =
        document.URL.indexOf("localhost") > -1
          ? "http://localhost:3000/"
          : `file://${path.join(
              __dirname,
              "./build",
              "lib",
              "pdf",
              "web",
              "viewer.html"
            )}`;
      let url = `${
        window.navigator.platform.indexOf("Win") > -1
          ? "lib/pdf/web/"
          : "lib\\pdf\\web\\"
      }viewer.html?file=${book.key}`;
      return document.URL.indexOf("localhost") > -1
        ? pdfLocation + url
        : `${pdfLocation}?file=${book.key}`;
    } else {
      return `./lib/pdf/web/viewer.html?file=${book.key}`;
    }
  }
  static reloadBooks() {
    if (isElectron) {
      if (StorageUtil.getReaderConfig("isOpenInMain") === "yes") {
        window.require("electron").ipcRenderer.invoke("reload-tab", "ping");
      } else {
        window.require("electron").ipcRenderer.invoke("reload-reader", "ping");
      }
    } else {
      window.location.reload();
    }
  }
  static getRendtion = (
    result: ArrayBuffer,
    format: string,
    readerMode: string,
    charset: string,
    animation: string
  ) => {
    let rendition;
    if (format === "CACHE") {
      rendition = new window.Kookit.CacheRender(result, readerMode, animation);
    } else if (format === "MOBI" || format === "AZW3" || format === "AZW") {
      rendition = new window.Kookit.MobiRender(result, readerMode, animation);
    } else if (format === "EPUB") {
      rendition = new window.Kookit.EpubRender(result, readerMode, animation);
    } else if (format === "TXT") {
      let text = iconv.decode(Buffer.from(result), charset || "utf8");
      rendition = new window.Kookit.TxtRender(text, readerMode, animation);
    } else if (format === "MD") {
      rendition = new window.Kookit.MdRender(result, readerMode, animation);
    } else if (format === "FB2") {
      rendition = new window.Kookit.Fb2Render(result, readerMode, animation);
    } else if (format === "DOCX") {
      rendition = new window.Kookit.DocxRender(result, readerMode, animation);
    } else if (
      format === "HTML" ||
      format === "XHTML" ||
      format === "MHTML" ||
      format === "HTM" ||
      format === "XML"
    ) {
      rendition = new window.Kookit.HtmlRender(
        result,
        readerMode,
        format,
        animation
      );
    } else if (
      format === "CBR" ||
      format === "CBT" ||
      format === "CBZ" ||
      format === "CB7"
    ) {
      rendition = new window.Kookit.ComicRender(
        copyArrayBuffer(result),
        readerMode,
        format,
        animation
      );
    }
    return rendition;
  };
  static openBookDetailsWindow(book: BookModel) {
    // 创建一个新的窗口
    const detailsWindow = window.open('', '_blank');
        
    // 设置窗口的标题
    detailsWindow.document.title = `Book Details - ${book.name}`;
        
    // 创建并设置窗口的内容
    const content = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Book Details - ${book.name}</title>
        </head>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .container {
                display: flex;
                max-width: 1000px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              .book-info {
                flex: 1;
                padding: 20px;
              }
              .book-cover {
                width: auto;
                height: auto;
                border-radius: 4px;
                margin-right: 20px;
              }
              h1 {
                color: #333;
                margin-top: 0;
              }
              p {
                color: #666;
              }
              .button {
                display: inline-block;
                padding: 10px 15px;
                margin-top: 10px;
                color: #fff;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 5px;
              }
              .button:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="${book.cover}" alt="Book Cover" class="book-cover" />
              <div class="book-info">
                <h1>${book.name}</h1>
                <p><strong>作者:</strong> ${book.author}</p>
                <p><strong>出版商:</strong> ${book.publisher}</p>
                <p><strong>描述:</strong> ${book.description}</p>
                <p><strong>格式:</strong> ${book.format}</p>
                <p><strong>大小:</strong> ${book.size} 字节</p>
                <p><strong>页数:</strong> ${book.page}</p>
                <p><strong>路径:</strong> ${book.path}</p>
                <p><strong>字符集:</strong> ${book.charset}</p>
                
              </div>
            </div>
          </body>
        </html>
      `;
        
    // 将内容写入新窗口
    detailsWindow.document.write(content);
    detailsWindow.document.close();
  }
  static generateBook(
    bookName: string,
    extension: string,
    md5: string,
    size: number,
    path: string,
    file_content: ArrayBuffer
  ) {
    return new Promise<BookModel | string>(async (resolve, reject) => {
      try {
        let cover: any = "";
        let key: string,
          name: string,
          author: string,
          publisher: string,
          description: string,
          charset: string,
          page: number;
        [name, author, description, publisher, charset, page] = [
          bookName,
          "Unknown author",
          "",
          "",
          "",
          0,
        ];
        let metadata: any;
        let rendition = BookUtil.getRendtion(
          file_content,
          extension.toUpperCase(),
          "",
          "",
          StorageUtil.getReaderConfig("isSliding") === "yes" ? "sliding" : ""
        );

        switch (extension) {
          case "pdf":
            metadata = await getPDFMetadata(copyArrayBuffer(file_content));
            [name, author, publisher, cover, page] = [
              metadata.name || bookName,
              metadata.author || "Unknown author",
              metadata.publisher || "",
              metadata.cover || "",
              metadata.pageCount || 0,
            ];
            if (cover.indexOf("image") === -1) {
              cover = "";
            }
            break;
          case "epub":
            metadata = await rendition.getMetadata();
            if (metadata === "timeout_error") {
              resolve("get_metadata_error");
              break;
            } else if (!metadata.name) {
              break;
            }

            [name, author, description, publisher, cover] = [
              metadata.name || bookName,
              metadata.author || "Unknown author",
              metadata.description || "",
              metadata.publisher || "",
              metadata.cover || "",
            ];
            if (cover.indexOf("image") === -1) {
              cover = "";
            }
            break;
          case "mobi":
          case "azw":
          case "azw3":
            metadata = await rendition.getMetadata();
            [name, author, description, publisher, cover] = [
              metadata.name || bookName,
              metadata.author || "Unknown author",
              metadata.description || "",
              metadata.publisher || "",
              metadata.cover || "",
            ];
            break;
          case "fb2":
            metadata = await rendition.getMetadata();
            [name, author, description, publisher, cover] = [
              metadata.name || bookName,
              metadata.author || "Unknown author",
              metadata.description || "",
              metadata.publisher || "",
              metadata.cover || "",
            ];
            break;
          case "cbr":
          case "cbt":
          case "cbz":
          case "cb7":
            metadata = await rendition.getMetadata();
            cover = metadata.cover;
            break;
          case "txt":
            metadata = await rendition.getMetadata(file_content);
            charset = metadata.charset;
            break;
          default:
            break;
        }
        let format = extension.toUpperCase();
        key = new Date().getTime() + "";
        if (
          StorageUtil.getReaderConfig("isPrecacheBook") === "yes" &&
          extension !== "pdf"
        ) {
          let cache = await rendition.preCache(file_content);
          if (cache !== "err") {
            BookUtil.addBook("cache-" + key, cache);
          }
        }
        resolve(
          new BookModel(
            key,
            name,
            author,
            description,
            md5,
            cover,
            format,
            publisher,
            size,
            page,
            path,
            charset
          )
        );
      } catch (error) {
        console.log(error);
        resolve("get_metadata_error");
      }
    });
  }
}

export default BookUtil;

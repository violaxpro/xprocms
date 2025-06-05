import React, { useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { API_URL } from "helpers/api_helper";
import { getImageUrl } from "helpers/utils";
import { Editor as ClassicEditor } from 'ckeditor5-custom-build/build/ckeditor';
// import { Alignment } from '@ckeditor/ckeditor5-alignment';
// import Image from "@ckeditor/ckeditor5-image/src/image";

const UPLOAD_ENDPOINT = "upload-image";

export default function Editor({ handleChange, ...props }) {
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("image", file);
            // let headers = new Headers();
            // headers.append("Origin", "http://localhost:3000");
            fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
              method: "post",
              body: body
              // mode: "no-cors"
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: getImageUrl(res.filename)
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      }
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  return (
    <div className="App">
      <CKEditor
        editor={ClassicEditor}
        config={{
          extraPlugins: [uploadPlugin],
          // plugins: [Alignment],
          toolbar: ["selectAll", "heading", 'alignment', "undo", "redo", "bold", "italic", "blockQuote", "link", "uploadImage", "imageUpload", "imageTextAlternative", "toggleImageCaption", "imageStyle:inline", "imageStyle:alignLeft", "imageStyle:alignRight", "imageStyle:alignCenter", "imageStyle:alignBlockLeft", "imageStyle:alignBlockRight", "imageStyle:block", "imageStyle:side", "imageStyle:wrapText", "imageStyle:breakText", "indent", "outdent", "numberedList", "bulletedList", "mediaEmbed", "insertTable", "tableColumn", "tableRow", "mergeTableCells"
          ],
          shouldNotGroupWhenFull: false
        }}
        // data="<p>Hello from CKEditor 5!</p>"
        // onBlur={((editor, a) => {
        //   console.log(editor)
        //   console.log(a)
        // })}
        onReady={editor => {
          // You can store the "editor" and use when it is needed.
          // console.log(editor.data.set(props?.data))
          // console.log('Editor is ready to use!', editor);
        }}
        {...props}
      />
    </div>
  );
}
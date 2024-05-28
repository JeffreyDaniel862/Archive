import { Button, Select, TextInput } from "flowbite-react";
import { Form } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef } from "react";

export default function PostForm({ title }) {

    const editor = useRef();
    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "clean",
    ];
    const modules = {
        toolbar: {
          container: [
            [{ header: [2, 3, 4, false] }],
            ["bold", "italic", "underline", "blockquote"],
            [{ color: [] }],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
          ],
        //   handlers: {
        //     image: imageHandler,
        //   },
        },
        clipboard: {
          matchVisual: true,
        },
      }

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">{title}</h1>
            <Form className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <TextInput required className="flex-1" type="text" placeholder="Title" />
                    <Select required>
                        <option value="holder">Select a category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="react.js">React.js</option>
                        <option value="node.js">Node.js</option>
                        <option value="express.js">Express.js</option>
                        <option value="postgresql">Postgresql</option>
                        <option value="git">Git</option>
                    </Select>
                </div>
                <div className="flex gap-3 justify-between items-center w-full border-4 p-3 border-teal-700 border-dashed hover:border-double rounded-md">
                    <input required type="file" accept="image/*" className="rounded-sm" />
                    <Button gradientDuoTone={'greenToBlue'} outline>Upload</Button>
                </div>
                <ReactQuill formats={formats} modules={modules} ref={editor} theme="snow" className="h-72 mb-12" required placeholder="Your content please ..." />
                <Button type="submit" className=" mt-4 bg-gradient-to-r from-blue-600 to-sky-500">Publish</Button>
            </Form>
        </div>
    )
}
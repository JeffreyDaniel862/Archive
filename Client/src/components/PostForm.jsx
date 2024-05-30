import { Alert, Button, Select, TextInput } from "flowbite-react";
import { Form, redirect, useActionData, useSubmit } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../firebase";

export default function PostForm({ title }) {
  const { user } = useSelector(state => state.user);
  const [formData, setFormData] = useState({ userId: user?.id });
  const quill = useRef();
  const submit = useSubmit();
  const data = useActionData();

  useEffect(() => {
    if (data && data.statusCode != 201) {

    }
  }, [])

  const handleImageUpload = async (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        error => {
          console.log(error);
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(downloadURL => {
              resolve(downloadURL);
              console.log(downloadURL);
            })
            .catch(error => {
              console.log(error);
              reject(error);
            })
        }
      )
    })
  }

  const imageHandler = useCallback(() => {
    // Create an input element of type 'file'
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // When a file is selected
    input.onchange = async () => {
      const file = input.files[0];
      const reader = new FileReader();
      const link = await handleImageUpload(file);
      // Read the selected file as a data URL
      reader.onload = () => {
        const imageUrl = link;
        const quillEditor = quill.current.getEditor();
        // Get the current selection range and insert the image at that index
        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };

      reader.readAsDataURL(file);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    submit(formData, { method: 'POST' });
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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

  const modules = useMemo(
    () => ({
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
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler]
  );

  const handleCoverImage = async (event) => {
    const coverImage = await handleImageUpload(event.target.files[0]);
    setFormData(prev => ({ ...prev, coverImage }));
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">{title}</h1>
      <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <TextInput name="title" required className="flex-1" type="text" placeholder="Title" onChange={handleChange} />
          <Select name="category" required onChange={handleChange}>
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
          <input required type="file" accept="image/*" className="rounded-sm" onChange={handleCoverImage} />
          <Button gradientDuoTone={'greenToBlue'} outline>Upload</Button>
        </div>
        <ReactQuill onChange={value => setFormData(prev => ({ ...prev, content: value }))} name='content' formats={formats} modules={modules} ref={el => quill.current = el} theme="snow" className="h-72 mb-12" required placeholder="Your content please ..." />
        <Button type="submit" className=" mt-4 bg-gradient-to-r from-blue-600 to-sky-500">Publish</Button>
      </Form>
      {
        data && data.statusCode != 201 && <Alert color={'failure'} className="mt-4">{data?.message || 'Unable to post blog'}</Alert>
      }
    </div>
  )
}

export const postAction = async ({ request }) => {
  const data = await request.formData();
  const postInfo = {}
  data.forEach((value, key) => postInfo[key] = value);
  const { userId, ...remain } = postInfo;
  try {
    const response = await fetch('/jd/post/create-post/' + userId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postInfo)
    });

    if (response.ok) {
      return redirect('/dashboard?tab=profile')
    }
    return response;
  } catch (error) {
    console.log(error);
  }
}
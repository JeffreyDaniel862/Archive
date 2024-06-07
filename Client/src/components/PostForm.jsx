import { Alert, Button, Select, TextInput } from "flowbite-react";
import { Form, json, redirect, useActionData, useSubmit } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../firebase";

export default function PostForm({ title, method, postData }) {
  const { user } = useSelector(state => state.user);
  const [formData, setFormData] = useState(undefined);
  const quill = useRef();
  const submit = useSubmit();
  const data = useActionData();
  const coverImageRef = useRef(null);
  const [imageUpload, setImageUpload] = useState(false);

  useEffect(() => {
    if (postData) {
      const { createdAt, updatedAt, slug, ...data } = postData;
      console.log(data);
      setFormData(data);
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
    const submitData = { ...formData, userId: user?.id }
    console.log(submitData);
    submit(submitData, { method: method });
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
    setImageUpload(true)
    const coverImage = await handleImageUpload(event.target.files[0]);
    setFormData(prev => ({ ...prev, coverImage }));
    setImageUpload(false)
  }

  let content = "Upload cover image"

  if (formData && formData.coverImage) {
    content = "Change cover image"
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">{title}</h1>
      <Form method={method} className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <TextInput defaultValue={formData ? formData.title : ''} name="title" required className="flex-1" type="text" placeholder="Title" onChange={handleChange} />
          <Select value={formData ? formData.category : ''} name="category" required onChange={handleChange}>
            <option value="holder">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react.js">React.js</option>
            <option value="node.js">Node.js</option>
            <option value="express.js">Express.js</option>
            <option value="postgresql">Postgresql</option>
            <option value="git">Git</option>
          </Select>
        </div>
        <div className="flex flex-col gap-3 justify-between items-center w-full border-4 p-3 border-teal-700 border-dashed hover:border-double rounded-md">
          {formData && formData.coverImage && <img className="w-full h-60 object-cover rounded-lg" src={formData.coverImage} alt="cover image" />}
          <input type="file" ref={coverImageRef} accept="image/*" className="rounded-sm hidden" onChange={handleCoverImage} />
          <Button disabled={imageUpload} className="self-end" gradientDuoTone={'greenToBlue'} onClick={() => coverImageRef.current.click()} outline>{imageUpload ? "Uploading" : content}</Button>
        </div>
        <ReactQuill value={formData ? formData.content : ''} onChange={value => setFormData(prev => ({ ...prev, content: value }))} name='content' formats={formats} modules={modules} ref={el => quill.current = el} theme="snow" className="h-72 mb-12" required placeholder="Your content please ..." />
        <Button type="submit" className=" mt-4 bg-gradient-to-r from-blue-600 to-sky-500">{method === "POST" ? "Publish Writ" : "Update Writ"}</Button>
      </Form>
      {
        data && <Alert color={'failure'} className="mt-4">{data?.message || 'Unable to post blog'}</Alert>
      }
    </div>
  )
}

export const postAction = async ({ request }) => {
  const method = request.method
  const data = await request.formData();
  const postInfo = {}
  data.forEach((value, key) => postInfo[key] = value);
  const { userId, ...remain } = postInfo;
  try {
    let response;
    if (method === "POST") {
      response = await fetch('/jd/post/create-post/' + userId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postInfo)
      });
    }
    if (method === "PUT") {
      response = await fetch(`/jd/post/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postInfo)
      });
    }
    const resData = await response.json();
    if (response.ok) {
      return redirect('/dashboard?tab=posts');
    }
    return resData;
  } catch (error) {
    throw json({ message: "Bad request" }, { status: 500 });
  }
}
'use client'

import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";
import io from "socket.io-client";

const socket = io("https://api-2-production-d7f0.up.railway.app/", {
  transports: ["websocket", "polling", "flashsocket"],
}); // Replace with your server URL

function FileStorage() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const imagesListRef = ref(storage, "images/");

  const uploadFile = () => {
    if (imageUpload == null) return;

    setLoading(true);

    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        setImageUrls((prev) => [...prev, url]);

        // Emit a socket event to notify other clients about the new upload
        socket.emit("newUpload", url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // Clear existing image URLs
    setImageUrls([]);

    // Fetch existing images from Firebase Storage
    listAll(imagesListRef)
      .then((response) => {
        return Promise.all(
          response.items.map((item) => getDownloadURL(item))
        );
      })
      .then((urls) => {
        setImageUrls(urls);
      })
      .catch((error) => {
        console.error("Error fetching existing images:", error);
      });

    // Listen for newUpload events from the WebSocket server
    socket.on("newUpload", (url) => {
      setImageUrls((prev) => [...prev, url]);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => socket.disconnect();
  }, []);

  const filteredImages = imageUrls.filter((url) =>
    url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 text-center">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
        className="mb-4"
      />
      <button
        onClick={uploadFile}
        className="bg-indigo-800 text-white px-4 py-2 rounded cursor-pointer"
      >
        Upload Image
      </button>
      {loading && <p className="mt-4 text-gray-500">Uploading...</p>}
      <input
        type="text"
        placeholder="Search Images"
        className="mt-4 ml-2 p-2 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mt-4 flex flex-wrap justify-center">
        {filteredImages.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Image ${index}`}
            className="max-w-full max-h-48 m-2 rounded"
          />
        ))}
      </div>
    </div>
  );
}

export default FileStorage;

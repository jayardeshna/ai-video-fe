"use client";

import { Dropdown } from "@/components/dropdown";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

const languages = {
  English: "en",
  Hindi: "hi",
  Bengali: "bn",
  Gujarati: "gu",
  Kannada: "kn",
  Malayalam: "ml",
  Marathi: "mr",
  Punjabi: "pa",
  Tamil: "ta",
  Telugu: "te",
  Urdu: "ur",
};

const transitionDelay = {
  "0 sec": 0,
  "1 sec": 1,
  "2 sec": 2,
  "3 sec": 3,
  "4 sec": 4,
  "5 sec": 5,
  "6 sec": 6,
  "7 sec": 7,
  "8 sec": 8,
  "9 sec": 9,
  "10 sec": 10,
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("English");
  const [time, setTime] = useState("0 sec");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileUploaded(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("Uploading...");

    const timer = setTimeout(() => {
      setMessage("Translating...");
    }, 30000);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `http://localhost:4000/api/v1/upload?language=${language}&language_code=${languages[language]}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(response.data.slides);
      setFileName(response.data.filename);
      clearTimeout(timer);
      alert("File processed successfully");
    } catch (error) {
      alert("There was an error processing the file.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const handleTextChange = (index, newText) => {
    const updatedSlides = response.map((slide, i) =>
      i === index ? { ...slide, texts: newText } : slide
    );
    setResponse(updatedSlides);
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setMessage("Generating Video...");
    const data = { slides: response, filename: fileName };
    console.log(data);
    const responseFromGenerateVideo = await axios.post(
      `http://localhost:4000/api/v1/generate-video?language_code=${languages[language]}&tansition_delay=${transitionDelay[time]}`,
      data
    );
    if (responseFromGenerateVideo.status === 200) {
      setResponse([]);
      setLoading(false);
      const filePath = responseFromGenerateVideo.data.final_video;
      alert("Video Generated Successfully !");
      window.electronAPI.openFolder(filePath);
    }
  };

  return (
    <>
      {response.length === 0 ? (
        <div
          className="min-h-screen flex flex-col md:flex-row bg-blue-100 overflow-hidden"
          style={{ height: "100vh" }}
        >
          <div className="basis-full md:basis-1/2 mt-[3%] mx-4 md:mx-10">
            <div className="flex flex-col gap-y-5 text-center md:text-left">
              <div className="font-bold text-2xl md:text-3xl text-blue-600">
                PowerPoint to Video and Audio Converter
              </div>
              <div className="text-lg md:text-xl text-gray-600">
                Effortlessly convert your PowerPoint presentations into video
                and audio files with our online tool.
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-2/3 mx-auto text-center mt-10">
              <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-6">
                Upload Your PPT
              </h2>
              <input
                type="file"
                accept=".pptx,.ppt"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-600
                    hover:file:bg-blue-100"
              />
              {fileUploaded && (
                <Dropdown
                  title={"Language"}
                  options={[
                    "English",
                    "Hindi",
                    "Gujarati",
                    "Bengali",
                    "Kannada",
                    "Malayalam",
                    "Marathi",
                    "Punjabi",
                    "Tamil",
                    "Telugu",
                    "Urdu",
                  ]}
                  setValue={setLanguage}
                />
              )}
              {loading && (
                <div className="mt-4 text-blue-600">
                  <p>{message}</p>
                  <div className="flex justify-center mt-2">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-8 w-8"></div>
                  </div>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={!fileUploaded || loading}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
              >
                Submit
              </button>
            </div>
          </div>
          <div
            className="hidden md:flex items-center justify-center w-full overflow-hidden"
            style={{ width: "60%" }}
          >
            <Image
              src={"/home.jpeg"}
              alt="home-image"
              className="w-full rounded-l-full"
              layout="responsive"
              width={100}
              height={100}
              unoptimized
            />
          </div>
        </div>
      ) : (
        <div
          className="min-h-screen flex flex-col-reverse lg:flex-row items-start justify-center p-4 md:p-6 lg:p-10 bg-blue-100 gap-5"
          style={{ height: "100%" }}
        >
          <div
            className="bg-white p-4 sm:p-6 md:p-4 rounded-lg shadow-lg w-full lg:w-2/3 m-2 order-2 lg:order-1 overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "100%", marginLeft: "-3px" }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-4 sm:mb-5 md:mb-6 text-center">
              Edit Slides
            </h2>

            {response.map((slide, index) => (
              <div key={slide.slide_number} className="mb-4 sm:mb-5">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 text-center">
                  Slide {slide.slide_number}
                </label>
                <textarea
                  value={slide.texts}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  className="block w-full p-2 sm:p-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows="4"
                />
              </div>
            ))}
          </div>

          <div
            className="relative flex flex-col lg:flex-col-reverse items-center justify-center w-full lg:w-1/3 h-auto lg:h-screen lg:sticky lg:top-0 order-1 lg:order-2"
            style={{ height: "100%" }}
          >
            <Image
              src={"/ppt.png"}
              alt="ppt-image"
              width={100}
              height={100}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-12 lg:left-12 -rotate-6 hidden sm:block md:block"
              unoptimized
            />
            <Image
              src={"/ppt-2.png"}
              alt="ppt-image-2"
              width={100}
              height={100}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-12 lg:right-12 rotate-6 hidden sm:block md:block"
              unoptimized
            />
            <Image
              src={"/ai.png"}
              alt="ai-image"
              width={100}
              height={100}
              className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-12 lg:left-12 -rotate-6 hidden lg:block"
              unoptimized
            />
            <Image
              src={"/ai-2.png"}
              alt="ai-2-image"
              width={100}
              height={100}
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-12 lg:right-12 rotate-6 hidden lg:block"
              unoptimized
            />

            <div className="relative z-10 bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-md shadow-md w-full max-w-sm lg:max-w-none">
              <Dropdown
                title={"Transition Time"}
                options={[
                  "0 sec",
                  "1 sec",
                  "2 sec",
                  "3 sec",
                  "4 sec",
                  "5 sec",
                  "6 sec",
                  "7 sec",
                  "8 sec",
                  "9 sec",
                  "10 sec",
                ]}
                setValue={setTime}
              />
              {loading && (
                <div className="mt-4 text-blue-600 flex flex-col items-center">
                  <div className="flex justify-center mt-2">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-200 h-8 w-8"></div>
                  </div>
                  <p className="text-center mt-2">{message}</p>
                </div>
              )}
              <button
                onClick={handleGenerateVideo}
                disabled={loading}
                className="mt-4 sm:mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700"
              >
                Generate Video
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

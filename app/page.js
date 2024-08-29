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
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setUploadedFileName(uploadedFile?.name);
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
      alert("File processed successfully");
    } catch (error) {
      alert("There was an error processing the file.");
    } finally {
      clearTimeout(timer);
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
    const timer = setTimeout(() => {
      setMessage("Generating Audio...");
    }, 30000);
    const data = { slides: response, filename: fileName };
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
    setMessage("");
    clearTimeout(timer);
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
            <div className="flex justify-center items-center bg-white p-7 rounded-2xl shadow-lg w-full md:w-2/3 mx-auto text-center mt-10">
              <div className="w-full flex flex-col justify-center items-center">
                <Image
                  src={"/upload-icon.png"}
                  alt="ppt-image"
                  width={50}
                  height={50}
                  className="mb-2.5"
                  unoptimized
                />
                <h3 className="text-xl md:text-xl font-bold text-black-600 mb-1">
                  {fileUploaded ? "Uploaded File" : "Upload Your PPT"}
                </h3>
                {!fileUploaded && (
                  <h5 className="text-xs md:text-xs font-bold text-gray-600 mb-3">
                    Click 'Upload a file' to get started upload
                  </h5>
                )}
                {fileUploaded ? (
                  <div className="inline-flex items-center max-w-[16rem] overflow-hidden text-ellipsis whitespace-nowrap">
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 48 48"
                      style={{ enableBackground: "new 0 0 48 48" }}
                      xmlSpace="preserve"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        style={{ fill: "#D35230" }}
                        d="M8,24c0,9.941,8.059,18,18,18s18-8.059,18-18H26H8z"
                      />
                      <path
                        style={{ fill: "#FF8F6B" }}
                        d="M26,6v18h18C44,14.059,35.941,6,26,6z"
                      />
                      <path
                        style={{ fill: "#ED6C47" }}
                        d="M26,6C16.059,6,8,14.059,8,24h18V6z"
                      />
                      <path
                        style={{ opacity: 0.05 }}
                        d="M26,16.681C26,14.648,24.352,13,22.319,13H11.774C9.417,16.044,8,19.852,8,24
                c0,5.116,2.145,9.723,5.571,13h8.747C24.352,37,26,35.352,26,33.319V16.681z"
                      />
                      <path
                        style={{ opacity: 0.07 }}
                        d="M22.213,13.333H11.525C9.32,16.321,8,20.002,8,24c0,4.617,1.753,8.814,4.611,12h9.602
                c1.724,0,3.121-1.397,3.121-3.121V16.454C25.333,14.731,23.936,13.333,22.213,13.333z"
                      />
                      <path
                        style={{ opacity: 0.09 }}
                        d="M22.106,13.667H11.276C9.218,16.593,8,20.151,8,24c0,4.148,1.417,7.956,3.774,11h10.332
                c1.414,0,2.56-1.146,2.56-2.56V16.227C24.667,14.813,23.52,13.667,22.106,13.667z"
                      />
                      <linearGradient
                        id="SVGID_1_"
                        gradientUnits="userSpaceOnUse"
                        x1="4.5858"
                        y1="14.5858"
                        x2="22.7705"
                        y2="32.7705"
                      >
                        <stop offset="0" style={{ stopColor: "#CA4E2A" }} />
                        <stop offset="1" style={{ stopColor: "#B63016" }} />
                      </linearGradient>
                      <path
                        style={{ fill: "url(#SVGID_1_)" }}
                        d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16
                C24,33.105,23.105,34,22,34z"
                      />
                      <path
                        style={{ fill: "#FFFFFF" }}
                        d="M14.673,19.012H10v10h2.024v-3.521H14.3c1.876,0,3.397-1.521,3.397-3.397v-0.058
                C17.697,20.366,16.343,19.012,14.673,19.012z M15.57,22.358c0,0.859-0.697,1.556-1.556,1.556h-1.99v-3.325h1.99
                c0.859,0,1.556,0.697,1.556,1.556V22.358z"
                      />
                    </svg>
                    <span className="text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {uploadedFileName}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-900"
                    >
                      <svg
                        className="w-6 h-6 mr-2 bg-white text-black rounded-full p-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Upload Your PPT
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pptx,.ppt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
                {fileUploaded && !loading && (
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
                  <div className="mt-4 text-black">
                    <p>{message}</p>
                    <div className="flex justify-center mt-2">
                      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
                    </div>
                  </div>
                )}
                {fileUploaded && (
                  <button
                    onClick={handleSubmit}
                    disabled={!fileUploaded || loading}
                    className="mt-6 w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-900 disabled:bg-gray-500"
                  >
                    Submit
                  </button>
                )}
              </div>
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

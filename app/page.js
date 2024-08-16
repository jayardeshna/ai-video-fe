"use client";

import { Dropdown } from "@/components/dropdown";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [response, setResponse] = useState([
    // {
    //     "slide_number": 1,
    //     "texts": "પાવરપોઈન્ટ થી વિડિયો રૂપાંતરણનો ઓટોમેશન પ્રક્રિયા ઝલક અને પાયથોન વાપરીને અમલીકરણ - જય અરદેશના"
    // },
    // {
    //     "slide_number": 2,
    //     "texts": "કાર્યનો ઝલક ફ્રન્ટએન્ડ દ્વારા PPT ફાઇલ અપલોડ કરો. PPT માંથી સ્લાઈડ્સ અને ટેક્સ્ટ ને એક્સટ્રેક્ટ કરો. ટેક્સ્ટને કોઈપણ ભારતીય ભાષામાં ભાષાંતર કરો. ટ્રાન્સલેટ કરેલી ટેક્સ્ટને ઓડિયોમાં રૂપાંતર કરો, આ માટે ઇન્ડિયા TTS નો ઉપયોગ કરો. સ્લાઈડ ઇમેજીસ અને ઓડિયો ને વિડિઓ માં મર્જ કરો. ડાઉનલોડ માટે વિડિઓ પ્રદાન કરો."
    // },
    // {
    //     "slide_number": 3,
    //     "texts": "પગલું 1 : પાવરપોઇન્ટ ફાઇલો અપલોડ કરો વપરાશકર્તાઓ ફ્રન્ટેન્ડ ઇન્ટરફેસ દ્વારા તેમના PowerPoint ફાઈલો અપલોડ કરે છે. બેકએન્ડે અપલોડ કરેલી ફાઈલ મેળવે છે. પયોથોન લાઇબ્રેરીઓ વાપરવામાં આવી છે : ફ્લાસ્ક અપલોડ સંભાળવા માટે."
    // },
    // {
    //     "slide_number": 4,
    //     "texts": "પગલું 2: PPTX માંથી સ્લાઇડ્સ અને ટેક્સ્ટ એક્સટ્રેક્ટ કરો. python - pptx લાઇબ્રેરીનો ઉપયોગ કરીને સ્લાઇડની સામગ્રી વાંચવા અને એક્સટ્રેક્ટ કરવા. ટેક્સ્ટ, છબીઓ અને સ્લાઇડ લેઆઉટ્સ એક્સટ્રેક્ટ કરો."
    // },
    // {
    //     "slide_number": 5,
    //     "texts": "પગલું 3: OpenAI નો ઉપયોગ કરીને લખાણ અનુવાદ કરો ▶️ OpenAI ના ભાષા મોડેલ્સનો ઉપયોગ કરીને અંગ્રેજીથી કોઈપણ ભારતીય ભાષામાં લખાણ ભાષાંતર કરો. ▶️ લક્ષ્યિત ભાષાને સ્પષ્ટપણે નિર્ધારિત કરવાથી OpenAI ના GPT મોડેલ્સ તેમની ભાષાંતરની ક્રિયા માટે પ્રોમ્પ્ટ કરી શકાય છે."
    // },
    // {
    //     "slide_number": 6,
    //     "texts": "પગલું 4 : OpenAI અને TTS સેવાઓ વાપરીને ઓડિયો ઉત્પન્ન કરો OpenAI નો ઉપયોગ કરીને ટેક્સ્ટ પેદા કરો અથવા સુધારો, પછી તેને તેક્સ્ટ ટુ સ્પીચ(TTS) સેવાઓ દ્વારા ભાષાંતરિત કરો જે ભારતીય ભાષાઓનું સમર્થન કરે છે. OpenAI ની અગ્રેસર ભાષા ક્ષમતાઓ ને TTS સેવાઓ સાથે જોડીને ઉચ્ચ ગુણવત્તિનું ઓડિયો આઉટપુટ પ્રાપ્ત કરો."
    // },
    // {
    //     "slide_number": 7,
    //     "texts": "પગલું 5 : સ્લાઇડ છબીઓ અને ઓડિયોને વિડિયોમાં વિલીન કરો સ્લાઇડ ઇમેજો અને ઓડિયો ફાઇલો મર્જ કરવા માટે moviepy જેવી લાઇબ્રેરીઝનો ઉપયોગ કરો . દરેક સ્લાઇડને ઇમેજમાં બદલો અને તેને સાનુકૂળ ઓડિયો સાથે જોડો ."
    // },
    // {
    //     "slide_number": 8,
    //     "texts": "પગલું 6 : વિડિયો ડાઉનલોડ માટે પૂરી પાડો \"વિડિઓ ઉત્પન્ન થવા બાદ , તેને સર્વર પર સ્ટોર કરવામાં આવે છે. ડાઉનલોડ લિંકની સુવિધા વપરાશકર્તાને ફ્રન્ટેન્ડ દ્વારા આપવામાં આવે છે. પાયથોન લાઇબ્રેરીઓ: ફાઈલ સર્વ માટે ફ્લાસ્ક .\""
    // },
    // {
    //     "slide_number": 9,
    //     "texts": "આગળ છે ગુજરાતીમાં અનુવાદ:\n\nઉપયોગ કરેલી મુખ્ય ટેકનોલોજીઓ અને પાયથોન લાઇબ્રેરીઓ ▶️ Frontend : HTML / CSS , JavaScript , React ( વપરાશકર્તા ઇંટરફેસ માટે ) ▶️ Backend : ફ્રેમવર્ક્સ : Flask / Django ( વિનંતીઓ સંભાળવા, ફાઇલો પ્રક્રિયા કરવા માટે ) ▶️ ફાઇલ સ્ટોરેજ : Amazon S3 , Google Cloud Storage , Microsoft Azure બ્લોબ સ્ટોરેજ ( PowerPoint ફાઇલો, અંતિમ વિડિઓ અપલોડ કરવા અને સંગ્રહ કરવા માટે )"
    // },
    // {
    //     "slide_number": 10,
    //     "texts": "પ્રશ્નો અને ચર્ચા"
    // }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("");
  const [time, setTime] = useState("");
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
      formData.append("language", language);

      const response = await axios.post(
        `http://localhost:4000/api/v1/upload?language=${language}`,
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
    const data = { slides: response, filename: fileName };
    console.log(data);
    const responseFromGenerateVideo = await axios.post(
      `http://localhost:4000/api/v1/generate-video`,
      data
    );
    if (responseFromGenerateVideo.status === 200) {
      setResponse([]);
      const filePath = responseFromGenerateVideo.data.final_video;
      window.electronAPI.openFolder(filePath);
    }
  };

  return (
    <>
      {response.length === 0 ? (
        <div className="min-h-screen flex flex-col md:flex-row bg-blue-100">
          <div className="basis-full md:basis-1/2 mt-[15%] mx-4 md:mx-10">
            <div className="flex flex-col gap-y-5 text-center md:text-left">
              <div className="font-bold text-2xl md:text-3xl text-blue-600">
                PowerPoint to Video and Audio Converter
              </div>
              <div className="text-lg md:text-xl text-gray-600">
                Effortlessly convert your PowerPoint presentations into video
                and audio files with our online tool. Upload your PPT, and
                we&apos;ll create high-quality content ready for sharing, all
                without extra software.
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
                  options={["English", "Hindi", "Gujarati"]}
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
                disabled={!fileUploaded}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center w-full">
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
        <div className="min-h-screen flex flex-col lg:flex-row items-start p-4 md:p-10 bg-blue-100">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-2/3 m-2">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 mb-6 text-center">
              Edit Slides
            </h2>

            {response.map((slide, index) => (
              <div key={slide.slide_number} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Slide {slide.slide_number}
                </label>
                <textarea
                  value={slide.texts}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  className="block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows="4"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center w-full lg:w-1/3 h-auto lg:h-screen lg:sticky lg:top-0">
            <div className="relative w-full h-full">
              <Image
                src={"/ppt.png"}
                alt="ppt-image"
                width={200}
                height={100}
                className="absolute bottom-[12%] left-[12%] -rotate-6"
                unoptimized
              />
              <Image
                src={"/ppt-2.png"}
                alt="ppt-image-2"
                width={200}
                height={100}
                className="absolute top-[12%] right-[12%] rotate-6"
                unoptimized
              />
              <Image
                src={"/ai.png"}
                alt="ai-image"
                width={200}
                height={100}
                className="absolute top-[12%] left-[12%] -rotate-6"
                unoptimized
              />
              <Image
                src={"/ai-2.png"}
                alt="ai-2-image"
                width={200}
                height={100}
                className="absolute bottom-[12%] right-[12%] rotate-6"
                unoptimized
              />
            </div>
            <div className="bg-white p-6 lg:p-16 rounded-md shadow-md w-full">
              <Dropdown
                title={"Transition Time"}
                options={[
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
              <button
                onClick={handleGenerateVideo}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700"
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

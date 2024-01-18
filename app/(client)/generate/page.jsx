"use client"
import DropDown from "@/components/Dropdown";
import LoadingDots from "@/components/LoadingDots";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { themes, rooms } from "@/utils/dropdownTypes";
import { UploadDropzone } from "@bytescale/upload-widget-react";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";
import Toggle from "@/components/Toggle";
import { CompareSlider } from "@/components/ComponentSlider";
import  appendNewToName  from "@/utils/appendNewToName";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import Link from "next/link";


const options = {
    apiKey: "public_12a1ymKBztYX1c3oPdszcE2wdahs", // This is your API key.
    maxFileCount: 1,
    showFinishButton: true,
    styles: {
        colors: {
            primary: '#033664',
            error: '#D23F4D',
            shade100: '#111',
            shade200: 'red',
            shade400: '111'
        }
    }
};



const generate = () => {
    const router = useRouter(); 
    const { data: session, status, update } = useSession();
    const [theme, setTheme] = useState("Modern");
    const [room, setRoom] = useState("Living Rooms");
    const [originalPhoto, setOriginalPhoto] = useState(null);
    const [generatedPhoto, setGeneratePhoto] = useState(null);
    const [photoName, setPhotoName] = useState(null);
    const [generatePhotoLoaded, setGeneratePhotoLoaded] = useState(false);

    const [sideBySide, setSideBySide] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if(typeof window === 'undefined') return null;
    if(status === 'unauthenticated') {
        router.push("/");
    }

    const handleDelete = () => {
        setOriginalPhoto(null);
        setGeneratePhoto(null);
        setGeneratePhotoLoaded(false);
        setPhotoName(null);
        setError(null);
    };


    const handleGeneratePhoto = async (fileUrl) => {
        

        if(generatePhotoLoaded) {
            handleDelete
        } else {
            setLoading(true);
            const response = await fetch("/api/room/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    imageUrl: fileUrl,
                    theme,
                    room,
                    userId: session?.user?.id
                }),
                
            });
            let newPhoto = await response.json();
            if(response.status !== 200) {
                setError(response.statusText);
                toast.error(response.statusText)
            } else {
                setGeneratePhoto(newPhoto[1]);
                router.refresh()
                update();
                toast.success("Success!!")
            }
            setLoading(false)
        }
    }

    const UploadDropZone = () => (
        <UploadDropzone
          options={options}
          onUpdate={({ uploadedFiles }) => {
            if (uploadedFiles.length !== 0) {
                setPhotoName(uploadedFiles[0].originalFile.originalFileName);
                setOriginalPhoto(uploadedFiles[0].fileUrl);
            }
          }}
          width="600px"
          height="375px"
        />
    );

    if (session) {
        return (
            <div className="max-w-7xl mx-auto my-8 px-4 mt-20 flex flex-col items-center">
                <section className="text-center mb-10">
                    <h1 className="font-bold text-black text-5xl">
                        Generate Your Dream Room
                    </h1>
                </section>

                {!generatedPhoto && (
                        <section className="w-full max-w-sm mx-auto mb-12">
                        <div className="mb-10">
                            <p className="text-base font-semibold mb-4">
                                Choose your room theme
                            </p>
                            <DropDown
                                theme={theme}
                                setTheme={setTheme}
                                themes={themes}
                            />
                        </div>
                        <div className="mb-10">
                            <p className="text-base font-semibold mb-4">
                                Choose your room type
                            </p>
                            <DropDown
                                theme={room}
                                setTheme={setRoom}
                                themes={rooms}
                            />
                        </div>
                        {session?.user.credits > 0 && (
                            <div className="mt-8">
                            <p className="text-center font-medium">
                                Upload a picture of your room
                            </p>
                        </div>
                        )}

                        {!(session?.user.credits > 0) && (
                            <div className="mt-8">
                            <p className="text-center font-medium">
                                No More Credits,
                                <Link href="/pricing">
                                    Buy Now
                                </Link>
                            </p>
                        </div>
                        )}
                    </section>
                )}


                {generatedPhoto && (
                    <div>
                        Here's your remodeled <b>{room.toLowerCase()}</b> in the {" "}
                        <b>{theme.toLowerCase()}</b> theme!
                    </div>
                )}
                <div className={`${
                    generatePhotoLoaded ? "visible mt-6 mb-6 md:mb-4 -ml-8" : "invisible"
                }`}>
                    <Toggle
                        className={`${generatePhotoLoaded ? "visible mb-6" : "invisible"} `}
                        sideBySide={sideBySide}
                        setSideBySide={(newVal) => setSideBySide(newVal)}
                    />
                </div>

                {generatePhotoLoaded && sideBySide && (
                    <CompareSlider
                        original={originalPhoto}
                        generatedPhoto={generatedPhoto}
                    />
                )}

                {!originalPhoto && session?.user?.credits > 0 && <UploadDropZone />}
                {originalPhoto && !generatedPhoto && (
                    <div className="relative">
                        <Image
                            alt="Original Photo"
                            src={originalPhoto}
                            className='rounded-2x h-96'
                            width={475}
                            height={475}
                        />
                        <button onClick={() => handleDelete()} className="neu_button top-0 absolute right-0 p-2 m-2">
                            <FaTrashAlt className='w-4 h-4 hover:scale-125 duration-300'/> 
                        </button>
                    </div>
                )}
                {generatedPhoto && originalPhoto && !sideBySide && (
                    <div className="flex sm:space-x-4 sm:flex-row flex-col text-center">
                        <div>
                            <h2 className="mb-5 font-medium text-lg">Original Room</h2>

                            <Image
                                alt="original photo"
                                src={originalPhoto}
                                className="rounded-2xl h-96"
                                width={475}
                                height={475}
                            />

                        </div>
                        <div className="sm:mt-0 mt-8">
                            <h2 className="mb-5 font-medium text-lg">Generated Room</h2>
                            <Image
                                alt="generated photo"
                                src={generatedPhoto}
                                className="rounded-2xl h-96"
                                width={475}
                                height={475}
                                onLoadingComplete={() => setGeneratePhotoLoaded(true)}
                            />
                        </div>
                    </div>
                )}
                {loading && (
                    <button disabled className=" bg-[#033664] rounded-full text-white font-medium px-4 py-2 mt-8">
                        <span className="pt-4">
                            <LoadingDots
                                color="white"
                                style="large"
                            />
                        </span>
                    </button>
                )}
                <div className="flex-space-x-2 justify-center">
                    {originalPhoto && !loading && (
                        <button onClick={() => {
                            handleGeneratePhoto(originalPhoto)
                        }} className="bg-[#033664] rounded-full text-white font-medium px-4 py-2 mt-8 mt-8 mr-4">
                            {!generatePhotoLoaded && <span>Generate This Room</span>}
                            {generatePhotoLoaded && <span>Generate New Room</span>}
                        </button>
                    )}
                    {generatePhotoLoaded && (
                        <button
                        onClick={() => {
                            saveAs(generatedPhoto, appendNewToName(photoName));
                          }}
                        className="bg-black rounded-full text-white font-medium px-4 py-2 mt-8 ml-4">
                            Dwonload Generated Room
                        </button>
                    )}
                </div>
            </div>
        )
    }
};


export default generate;
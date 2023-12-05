"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";


const UserMenu = () => {
    const [toggleDropdown, setToggleDropdown] = useState(false);
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        };
        setUpProviders()
    }, [])
    return ( 
        <div>
            {session?.user ? (
            <div className="flex justify-center items-center gap-3">
                <Link href="/pricing">
                    <p className="text-base font-medium">Pricing</p>
                </Link>
                <div></div>
                <div className="text-base font-medium py-3 rounded cursor-pointer">
                    10 credits
                </div>
                <div className="relative">
                    <Image
                        width={35}
                        height={35}
                        className="rounded-full cursor-pointer"
                        alt="avatar"
                        src="/assets/images/placeholder.jpg"
                        onClick={() => setToggleDropdown((prev) => !prev)}
                    />
                    {toggleDropdown && (
                        <div className="dropdown">
                            <Link 
                                href="/my-rooms" 
                                className="dropdown_link" 
                                onClick={() => setToggleDropdown(false)}
                            >
                             My Rooms
                            </Link>
                            <Link
                                href="/generate"
                                className="dropdown_link"
                                onClick={() => setToggleDropdown(false)}
                            >
                             Create Room
                            </Link>
                            <button 
                            className="mt-2 w-full neu_button"
                            onClick={() => {
                                setToggleDropdown(false);
                                signOut();
                            }}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
            ) : (
                <>
                {providers && 
                    Object.values(providers).map((provider) => (
                    <button 
                        type="button" 
                        className="neu_button"
                        key={provider.name}
                        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                    >
                        Sign In
                    </button>
                    ))
                }
                
                </>
            )}
            
        </div>
    )
}

export default UserMenu
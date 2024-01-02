"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const themes = ["Modern", "Vintage", "Minimalist", "Professional"]

const Generate = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    return (
        <div>
            Pricing Page
        </div>
    )

};


export default Generate;
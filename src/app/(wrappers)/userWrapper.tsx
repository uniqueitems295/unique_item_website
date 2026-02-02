import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Whatsapp from '@/components/Whatsapp';
import React from 'react'

interface UserProps {
    children: React.ReactNode;
}

export default function UserWrapper({ children }: UserProps) {
    return (
        <>
            <Navbar />
            {children}
            <Whatsapp />
            <Footer />
        </>
    )
}

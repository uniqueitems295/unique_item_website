import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Whatsapp from '@/components/Whatsapp';
import AnnouncementBar from '@/components/AnnouncementBar';
import React from 'react'

interface UserProps {
    children: React.ReactNode;
}

export default function UserWrapper({ children }: UserProps) {
    return (
        <>
            <AnnouncementBar />
            <Navbar />
            {children}
            <Whatsapp />
            <Footer />
        </>
    )
}

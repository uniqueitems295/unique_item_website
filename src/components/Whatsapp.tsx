'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function Whatsapp() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            // show after user scrolls a bit
            setVisible(window.scrollY > 80);
        };

        onScroll(); // set initial state
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <Link
            href="https://wa.me/923191994293"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className={[
                'fixed bottom-5 right-5 z-50',
                'transition-all duration-300 ease-out',
                visible
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none',
            ].join(' ')}
        >
            <div
                className={[
                    'flex items-center gap-2 rounded-full px-3 py-3 shadow-lg',
                    'bg-green-500 text-white',
                    'hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]',
                    'transition-transform duration-200',
                ].join(' ')}
            >
                <FaWhatsapp size={25} />
            </div>
        </Link>
    );
}

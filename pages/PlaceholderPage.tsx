import React from 'react';

function PlaceholderPage() {
    return (
        <div className="flex h-screen items-center justify-center flex-col text-center">
            <h1 className="text-2xl font-bold">
                Fitur Belum Tersedia
            </h1>
            <p className="text-gray-500 mt-2">
                Maaf, fitur ini sedang dalam pengembangan.
            </p>
            <a href="/" className="mt-4 text-blue-600">
                Kembali ke Beranda
            </a>
        </div>
    );
}

export default PlaceholderPage;

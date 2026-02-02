import React from 'react';
import { Card } from '../../components';
import { APP_NAME } from '../../config/constants';

const Pengaturan = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
                <p className="text-gray-500">Konfigurasi aplikasi {APP_NAME}</p>
            </div>

            <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Informasi Aplikasi</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Nama Aplikasi</span>
                        <span className="font-medium text-gray-900">{APP_NAME}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Versi</span>
                        <span className="font-medium text-gray-900">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Status API</span>
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Mock Mode
                        </span>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Tentang</h3>
                <p className="text-gray-600 text-sm">
                    {APP_NAME} adalah sistem manajemen kos modern yang membantu Anda mengelola kamar,
                    penghuni, dan tagihan dengan mudah. Dibangun dengan React, Tailwind CSS, dan Zustand.
                </p>
            </Card>
        </div>
    );
};

export default Pengaturan;

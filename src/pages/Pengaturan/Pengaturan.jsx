import React, { useState } from 'react';
import { Settings, Bell, MessageSquare, Calendar, CheckCircle2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Pengaturan = () => {
    const { toast } = useToast();
    const [billingDate, setBillingDate] = useState('');
    const [reminderBefore, setReminderBefore] = useState([1, 3, 5, 7]);
    const [reminderAfter, setReminderAfter] = useState([1, 3, 5, 7]);

    // WhatsApp message templates state
    const [whatsappMessages, setWhatsappMessages] = useState({
        reminder: 'Halo {nama_penghuni},\n\nIni adalah pengingat pembayaran kos untuk:\n• Kamar: {nomor_kamar}\n• Periode: {bulan_tagihan}\n• Jumlah: {total}\n\nTagihan akan dibuat setiap tanggal {tanggal_penagihan} setiap bulan.\n\nTerima kasih!',
        dueDate: 'Halo {nama_penghuni},\n\nKami ingatkan bahwa hari ini adalah jatuh tempo pembayaran kos Anda:\n• Kamar: {nomor_kamar}\n• Periode: {bulan_tagihan}\n• Jumlah: {total}\n\nMohon segera melakukan pembayaran.\n\nTerima kasih!',
        overdue: 'Halo {nama_penghuni},\n\nKami ingin mengingatkan bahwa pembayaran kos Anda sudah terlambat:\n• Kamar: {nomor_kamar}\n• Periode: {bulan_tagihan}\n• Jumlah: {total}\n• Status: {status_pembayaran}\n\nMohon segera melakukan pembayaran untuk menghindari denda.\n\nTerima kasih!',
        success: 'Halo {nama_penghuni},\n\nPembayaran Anda telah diterima!\n• Kamar: {nomor_kamar}\n• Periode: {bulan_tagihan}\n• Jumlah: {total}\n• Tanggal: {tanggal_bayar}\n\nTerima kasih atas pembayaran tepat waktu!',
        mismatch: 'Halo {nama_penghuni},\n\nKami menerima pembayaran dari Anda, namun jumlahnya tidak sesuai:\n• Kamar: {nomor_kamar}\n• Periode: {bulan_tagihan}\n• Jumlah seharusnya: {total}\n• Jumlah diterima: {jumlah_bayar}\n\nMohon hubungi kami untuk klarifikasi.\n\nTerima kasih!',
    });

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [editingMessage, setEditingMessage] = useState('');

    const handleSave = () => {
        toast.success({
            title: 'Berhasil!',
            description: 'Pengaturan telah disimpan',
        });
    };

    const toggleReminderBefore = (day) => {
        setReminderBefore(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
        );
    };

    const toggleReminderAfter = (day) => {
        setReminderAfter(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
        );
    };

    const whatsappTemplates = [
        { id: 'reminder', label: 'Pesan Pengingat' },
        { id: 'dueDate', label: 'Pesan Jatuh Tempo' },
        { id: 'overdue', label: 'Pesan Terlambat' },
        { id: 'success', label: 'Pesan Berhasil' },
        { id: 'mismatch', label: 'Pesan Tidak Sesuai' },
    ];

    const openMessageEditor = (templateId) => {
        setCurrentTemplate(templateId);
        setEditingMessage(whatsappMessages[templateId]);
        setIsModalOpen(true);
    };

    const saveMessage = () => {
        setWhatsappMessages(prev => ({
            ...prev,
            [currentTemplate]: editingMessage,
        }));
        setIsModalOpen(false);
        toast.success({
            title: 'Berhasil!',
            description: 'Template pesan telah diperbarui',
        });
    };

    // Get billing date text
    const getBillingDateText = () => {
        if (!billingDate) return '...';
        const date = new Date(billingDate);
        return date.getDate();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
                <p className="text-gray-500 text-sm mt-1">Konfigurasi Sistem Penagihan</p>
            </div>

            <div className="space-y-6 max-w-4xl">
                {/* Pengaturan Tagihan */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center">
                            <Settings className="h-5 w-5 text-[#059669]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Pengaturan Tagihan</h3>
                            <p className="text-sm text-gray-500">Atur tanggal pembuatan tagihan bulanan</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Tagihan Bulanan
                        </label>
                        <div className="relative max-w-xs">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                value={billingDate}
                                onChange={(e) => setBillingDate(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Tagihan akan dibuat setiap tanggal {getBillingDateText()} setiap bulan
                        </p>
                    </div>
                </div>

                {/* Pengingat */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Pengingat</h3>
                            <p className="text-sm text-gray-500">Atur kapan pengingat dikirim sebelum dan sesudah jatuh tempo</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Kirim Pengingat sebelum jatuh tempo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Kirim Pengingat sebelum jatuh tempo
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {[1, 3, 5, 7].map((day) => (
                                    <button
                                        key={`before-${day}`}
                                        onClick={() => toggleReminderBefore(day)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${reminderBefore.includes(day)
                                            ? 'bg-[#059669] text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <CheckCircle2 className={`inline-block h-4 w-4 mr-1.5 ${reminderBefore.includes(day) ? 'opacity-100' : 'opacity-0'}`} />
                                        {day} Hari
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Kirim Pengingat setelah jatuh tempo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Kirim Pengingat setelah jatuh tempo
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {[1, 3, 5, 7].map((day) => (
                                    <button
                                        key={`after-${day}`}
                                        onClick={() => toggleReminderAfter(day)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${reminderAfter.includes(day)
                                            ? 'bg-teal-500 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <CheckCircle2 className={`inline-block h-4 w-4 mr-1.5 ${reminderAfter.includes(day) ? 'opacity-100' : 'opacity-0'}`} />
                                        {day} Hari
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifikasi WhatsApp */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-[#059669]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Notifikasi Whatsapp</h3>
                            <p className="text-sm text-gray-500">Atur notifikasi Otomatis via whatsapp</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Atur Pesan WhatsApp yang akan dikirim ke penghuni
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {whatsappTemplates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => openMessageEditor(template.id)}
                                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
                                >
                                    {template.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Save Button */}
            <div className="fixed bottom-8 right-8">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                    <Save className="h-5 w-5" />
                    Simpan Pengaturan
                </button>
            </div>

            {/* WhatsApp Message Editor Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Edit {whatsappTemplates.find(t => t.id === currentTemplate)?.label}
                        </DialogTitle>
                        <DialogDescription>
                            Sesuaikan template pesan WhatsApp. Gunakan variabel berikut:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Variable hints */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Variabel yang tersedia:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>• <code className="bg-white px-1.5 py-0.5 rounded">{'{nama_penghuni}'}</code> - Nama penghuni</div>
                                <div>• <code className="bg-white px-1.5 py-0.5 rounded">{'{nomor_kamar}'}</code> - Nomor kamar</div>
                                <div>• <code className="bg-white px-1.5 py-0.5 rounded">{'{bulan_tagihan}'}</code> - Bulan tagihan</div>
                                <div>• <code className="bg-white px-1.5 py-0.5 rounded">{'{total}'}</code> - Total tagihan</div>
                                <div>• <code className="bg-white px-1.5 py-0.5 rounded">{'{tanggal_penagihan}'}</code> - Tanggal penagihan</div>
                                <div>• <code className="bg-white px-1.5 py-0.5 rounded">{'{status_pembayaran}'}</code> - Status pembayaran</div>
                                <div>• <code className="bg-white px-1.5 py-0.5 rounded">{'{tanggal_bayar}'}</code> - Tanggal bayar</div>
                                <div>• <code className="bg-white px-1.5 py-0.5 rounded">{'{jumlah_bayar}'}</code> - Jumlah bayar</div>
                            </div>
                        </div>

                        {/* Message editor */}
                        <div>
                            <Label htmlFor="message">Template Pesan</Label>
                            <textarea
                                id="message"
                                value={editingMessage}
                                onChange={(e) => setEditingMessage(e.target.value)}
                                rows={10}
                                className="w-full mt-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-[#059669] transition-all font-mono"
                                placeholder="Masukkan template pesan..."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={saveMessage} className="bg-[#059669] hover:bg-[#047857]">
                            Simpan Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Pengaturan;
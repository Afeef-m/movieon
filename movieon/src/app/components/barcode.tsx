"use client";

interface BarcodeProps {
  code?: string; 
}

export default function Barcode({ code }: BarcodeProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-32 sm:w-40 h-10 bg-black/80 rounded-sm flex items-end gap-[2px] overflow-hidden">
        {[...Array(45)].map((_, i) => (
          <div
            key={i}
            className="bg-white"
            style={{
              width: i % 3 === 0 ? "3px" : "1px",
              height: "100%",
            }}
          />
        ))}
      </div>

      {code && (
        <p className="text-gray-600 text-xs mt-2 tracking-wider">
          {code}
        </p>
      )}
    </div>
  );
}

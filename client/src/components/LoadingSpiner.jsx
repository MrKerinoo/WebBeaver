import React from "react";

export default function LoadingSpiner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <img
        src="/src/assets/images/webBeaverFavIcon.png"
        alt="Loading..."
        className="h-auto w-96"
      />
    </div>
  );
}

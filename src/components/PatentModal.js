import React from 'react';

const PatentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl max-h-[95vh] w-full overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold z-10"
          >
            ×
          </button>
          <div className="text-white">
            <span className="inline-block bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold mb-3">
              US Patent
            </span>
            <h1 className="text-2xl font-bold mb-2">Secure Private Portable Vault Container</h1>
            <div className="flex items-center text-white/80 text-sm space-x-4">
              <span>Patent No. US 11,562,060 B2</span>
              <span>•</span>
              <span>January 24, 2023</span>
              <span>•</span>
              <span>Conveyance Media Group LLC</span>
            </div>
          </div>
        </div>

        {/* PDF Content */}
        <div className="h-[80vh] overflow-hidden">
          <iframe
            src={`/secure-portable-vault-patent.pdf?v=${Date.now()}`}
            className="w-full h-full border-0"
            title="US Patent 11,562,060 B2 - Secure Private Portable Vault Container"
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a 
              href={`/secure-portable-vault-patent.pdf?v=${Date.now()}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Download PDF
            </a>
            <span className="text-gray-600 text-sm">
              Patent filed September 21, 2021 • Issued January 24, 2023
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentModal;
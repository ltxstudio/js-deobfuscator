'use client';

import { useState } from 'react';
import { deobfuscateCode } from '../utils/deobfuscate';
import { Disclosure } from '@headlessui/react';
import { SunIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function Home() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [error, setError] = useState('');

  const handleDeobfuscate = () => {
    try {
      const result = deobfuscateCode(inputCode);
      setOutputCode(result);
      setError('');
    } catch (err) {
      setError('Failed to deobfuscate. Please check the input code.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <SunIcon className="h-8 w-8 text-yellow-400" />
          <h1 className="text-3xl font-bold">JS Deobfuscator Tool</h1>
        </header>

        {/* Instructions Disclosure */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between bg-gray-800 px-4 py-2 rounded-lg mb-4">
                <span>Instructions</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } h-5 w-5 text-yellow-400`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="bg-gray-700 p-4 text-gray-300 rounded-lg">
                <p>
                  This tool allows you to deobfuscate JavaScript code. Simply
                  paste the obfuscated code in the input box below, and click
                  "Deobfuscate" to see the formatted output.
                </p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Input Code Section */}
        <textarea
          placeholder="Paste obfuscated JavaScript code here..."
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="w-full h-40 p-4 text-sm bg-gray-800 border border-gray-700 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {/* Deobfuscate Button */}
        <button
          onClick={handleDeobfuscate}
          className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600 transition mb-6"
        >
          Deobfuscate
        </button>

        {/* Output Code Section */}
        <h2 className="text-2xl font-semibold mb-4">Output:</h2>
        <div className="bg-gray-800 p-4 rounded">
          <SyntaxHighlighter
            language="javascript"
            style={dracula}
            wrapLongLines
          >
            {outputCode || '// Your deobfuscated code will appear here.'}
          </SyntaxHighlighter>
        </div>
      </div>
    </main>
  );
}

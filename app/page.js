'use client';

import { useState } from 'react';
import { deobfuscateCode } from '../utils/deobfuscate';
import { Disclosure } from '@headlessui/react';
import {
  SunIcon,
  MoonIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  CodeBracketIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function Home() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark');

  const handleDeobfuscate = () => {
    try {
      const result = deobfuscateCode(inputCode);
      setOutputCode(result);
      setError('');
    } catch {
      setError('Failed to deobfuscate. Please check your input.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setInputCode(e.target.result);
      reader.readAsText(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
    alert('Code copied to clipboard!');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <main
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      } p-6`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">JS Deobfuscator Tool</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-800" />
            )}
          </button>
        </header>

        {/* Input Section */}
        <section className="mb-10">
          <textarea
            placeholder="Paste obfuscated JavaScript code here..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className={`w-full h-40 p-4 text-sm ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200'
            } border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
          />
          <input
            type="file"
            onChange={handleFileUpload}
            className="mb-4"
            accept=".js"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={handleDeobfuscate}
            className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600 transition"
          >
            Deobfuscate
          </button>
        </section>

        {/* Output Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Deobfuscated Code:</h2>
          <div className="relative bg-gray-800 p-4 rounded">
            <SyntaxHighlighter
              language="javascript"
              style={theme === 'dark' ? dracula : prism}
              wrapLongLines
            >
              {outputCode || '// Your deobfuscated code will appear here.'}
            </SyntaxHighlighter>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              <DocumentDuplicateIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-4">About</h2>
          <p>
            This tool is designed to help developers deobfuscate JavaScript code
            for improved readability and debugging.
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-4">Features</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
              Fast and accurate deobfuscation.
            </li>
            <li className="flex items-center gap-3">
              <CodeBracketIcon className="h-6 w-6 text-blue-400" />
              Supports file uploads.
            </li>
            <li className="flex items-center gap-3">
              <SunIcon className="h-6 w-6 text-yellow-400" />
              Dark and Light mode support.
            </li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold mb-4">FAQ</h2>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between bg-gray-800 px-4 py-2 rounded-lg mb-2">
                  <span>What is code deobfuscation?</span>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } h-5 w-5 text-yellow-400`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="bg-gray-700 p-4 text-gray-300 rounded-lg">
                  Code deobfuscation transforms obfuscated code into readable
                  code.
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between bg-gray-800 px-4 py-2 rounded-lg mb-2">
                  <span>Is deobfuscation always accurate?</span>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } h-5 w-5 text-yellow-400`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="bg-gray-700 p-4 text-gray-300 rounded-lg">
                  Deobfuscation is accurate but may need manual review in some
                  cases.
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </section>
      </div>
    </main>
  );
}

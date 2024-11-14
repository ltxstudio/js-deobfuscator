'use client';

import { useState } from 'react';
import { deobfuscateCode } from '../utils/deobfuscate';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import { Tab } from '@headlessui/react';
import { Disclosure } from '@headlessui/react';
import {
  SunIcon,
  MoonIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  DownloadIcon,
  ArrowUpTrayIcon,
  LanguageIcon,
  AdjustmentsHorizontalIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { motion } from 'framer-motion';

const themes = {
  dark: dracula,
  light: prism,
};

export default function Home() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('English');

  const handleDeobfuscate = () => {
    try {
      const deobfuscated = deobfuscateCode(inputCode);
      const formatted = prettier.format(deobfuscated, {
        parser: 'babel',
        plugins: [parserBabel],
      });
      setOutputCode(formatted);
      setError('');
    } catch (err) {
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

  const downloadOutput = () => {
    const blob = new Blob([outputCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deobfuscated.js';
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const switchLanguage = () => {
    setLanguage((prev) =>
      prev === 'English' ? 'Spanish' : 'English'
    ); // Extend for other languages.
  };

  return (
    <main
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      } p-6`}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4 mb-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">JS Deobfuscator Tool</h1>
        <div className="flex space-x-4">
          <button onClick={switchLanguage} className="p-2">
            <LanguageIcon className="h-6 w-6 text-gray-500" />
            <span className="ml-2">{language}</span>
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700">
            {theme === 'dark' ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-800" />
            )}
          </button>
        </div>
      </nav>

      {/* Sidebar + Main Sections */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-800 p-4 rounded-lg">
          <nav className="space-y-4">
            <a href="#about" className="block p-2 hover:bg-gray-700 rounded">
              About
            </a>
            <a href="#features" className="block p-2 hover:bg-gray-700 rounded">
              Features
            </a>
            <a href="#faq" className="block p-2 hover:bg-gray-700 rounded">
              FAQ
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="w-3/4">
          <Tab.Group>
            <Tab.List className="flex space-x-4 mb-4">
              <Tab
                className={({ selected }) =>
                  `py-2 px-4 rounded-lg ${
                    selected ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'
                  }`
                }
              >
                Input
              </Tab>
              <Tab
                className={({ selected }) =>
                  `py-2 px-4 rounded-lg ${
                    selected ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'
                  }`
                }
              >
                Output
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <textarea
                  placeholder="Paste obfuscated JavaScript here..."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className={`w-full h-40 p-4 text-sm ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  } border rounded`}
                />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="block mt-4"
                  accept=".js"
                />
              </Tab.Panel>

              <Tab.Panel>
                <div className="relative">
                  <SyntaxHighlighter
                    language="javascript"
                    style={themes[theme]}
                    wrapLongLines
                  >
                    {outputCode || '// Your deobfuscated code will appear here.'}
                  </SyntaxHighlighter>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button onClick={copyToClipboard} className="p-2 bg-gray-700 rounded">
                      <DocumentDuplicateIcon className="h-5 w-5 text-white" />
                    </button>
                    <button onClick={downloadOutput} className="p-2 bg-gray-700 rounded">
                      <DownloadIcon className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </section>
      </div>
      <footer className="text-center py-4 mt-10 border-t border-gray-700">
        <p>© 2024 JS Deobfuscator - All rights reserved.</p>
      </footer>
    </main>
  );
}

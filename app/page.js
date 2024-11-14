'use client';

import { useState } from 'react';
import { deobfuscateCode } from '../utils/deobfuscate';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import esprima from 'esprima';
import { ToastContainer, toast } from 'react-toastify';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {
  DocumentDuplicateIcon,
  DownloadIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  const handleDeobfuscate = () => {
    try {
      let deobfuscated = deobfuscateCode(inputCode);
      setSteps((prev) => [...prev, `Step ${prev.length + 1}: Deobfuscated code`]);
      setOutputCode(prettier.format(deobfuscated, { parser: 'babel', plugins: [parserBabel] }));
      setError('');
      toast.success('Code successfully deobfuscated!');
    } catch (err) {
      setError('Deobfuscation failed. Check input.');
      toast.error('Error during deobfuscation!');
    }
  };

  const handleSyntaxCheck = () => {
    try {
      esprima.parseScript(inputCode);
      toast.success('No syntax errors detected!');
    } catch (e) {
      setError(`Syntax Error: ${e.message}`);
      toast.error(`Syntax Error: ${e.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCode);
    toast.info('Code copied to clipboard!');
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

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-6 sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">JS Deobfuscator</h1>
          <ul className="flex space-x-4">
            <Link to="about" smooth className="cursor-pointer hover:text-yellow-400">About</Link>
            <Link to="features" smooth className="cursor-pointer hover:text-yellow-400">Features</Link>
            <Link to="faq" smooth className="cursor-pointer hover:text-yellow-400">FAQ</Link>
          </ul>
        </nav>
      </header>

      <section id="about" className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold">About This Tool</h2>
          <p className="mt-4 text-gray-300">
            JS Deobfuscator helps you transform obfuscated JavaScript into a readable format. Built for developers.
          </p>
        </div>
      </section>

      <section id="features" className="bg-gray-800 py-10">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Feature icon={CodeBracketIcon} title="Real-time Deobfuscation" />
            <Feature icon={ShieldCheckIcon} title="Syntax Validation" />
            <Feature icon={DocumentDuplicateIcon} title="Copy & Export Code" />
          </div>
        </div>
      </section>

      <section className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 bg-gray-800 p-6 rounded">
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste obfuscated JS here..."
              className="w-full h-64 bg-gray-700 p-2 rounded"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleDeobfuscate}
              className="mt-4 w-full bg-yellow-500 py-2 rounded text-black"
            >
              Deobfuscate
            </motion.button>
          </div>

          <div className="col-span-2 bg-gray-800 p-6 rounded">
            <Tab.Group>
              <Tab.List className="flex">
                <Tab className="py-2 px-4 bg-gray-700 rounded mr-2">Output</Tab>
                <Tab className="py-2 px-4 bg-gray-700 rounded">Steps</Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <SyntaxHighlighter language="javascript" style={dracula}>
                    {outputCode || '// Your deobfuscated code will appear here'}
                  </SyntaxHighlighter>
                </Tab.Panel>
                <Tab.Panel>
                  <ul>
                    {steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </section>

      <section id="faq" className="py-10">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold mb-6">FAQ</h2>
          <FAQ title="How does the tool work?" content="The tool applies reverse-engineering techniques." />
          <FAQ title="Is it secure?" content="Yes, all processing is done locally." />
        </div>
      </section>

      <ToastContainer />
    </main>
  );
}

function Feature({ icon: Icon, title }) {
  return (
    <div className="bg-gray-700 p-6 rounded text-center">
      <Icon className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}

function FAQ({ title, content }) {
  return (
    <div className="mb-4">
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-gray-400">{content}</p>
    </div>
  );
}

'use client'
import Editor from '@monaco-editor/react';
import { Languages } from 'lucide-react';
type Props = {
    language: string;
    value: string;
    onChange?: (value: string | undefined) => void;
    height?: string;
}
function CodeEditor({ language, value, onChange, height }: Props) {
    const handleChange = (value: string | undefined) => {
        if (onChange && value) {
            onChange(value);
        }
    };
    return (
        <div className='flex w-full justify-center items-center mt-10'>

        <Editor
            theme='vs-dark'
            height="400px"
            width="50%"
            defaultLanguage={language}
            value={value} language={language}
            onChange={handleChange} 
            />
            </div>
    )
}
export default CodeEditor;
"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit"
import { Toolbar } from './Toolbar'


export default function CustomTextEditor({
    description,
    onChange
} :{
    description:string
    onChange: (richText:string) => void
}){
    const editor = useEditor({
        extensions:[StarterKit.configure()],
        content:description,
        editorProps:{
            attributes:{
                class:"rounded-md border min-h-[150px] boder-input pl-6 pt-2"
            }
        },
        onUpdate({editor}) {
            onChange(editor.getHTML())
            console.log(editor.getHTML())
        }

    })

    return(
        <div className='flex flex-col justify-stretch min-h-[250px] '>
            <Toolbar editor={editor}/>
            <EditorContent className='list-disc list-inside' editor={editor}/>
        </div>
    )
}
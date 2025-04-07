// TODO: 글자 위치, 두께, 색깔, 모양 지정하기

// "use client";

// import { useCallback, useMemo, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import { useForm } from "react-hook-form";
// import Image from "next/image";
// import Placeholder from "@tiptap/extension-placeholder";
// // import ReactMarkdown from "react-markdown";

// type EditorFunction =
//   | "bold"
//   | "italic"
//   | "underline"
//   | "alignLeft"
//   | "alignCenter"
//   | "alignRight"
//   | "bullet"
//   | "numbering"
//   | "color";

// export default function Editors({
//   onChange,
//   value,
// }: {
//   onChange: (value: string) => void;
//   value: string;
// }) {
//   const { register } = useForm();
//   const [showLinkInput, setShowLinkInput] = useState<boolean>(false);

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       TextAlign.configure({
//         types: ["heading", "paragraph"],
//       }),
//       Placeholder.configure({
//         placeholder: "이 곳을 클릭해 노트 작성을 시작해주세요",
//       }),
//     ],
//     editorProps: {
//       attributes: {
//         class:
//           "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
//       },
//     },
//     content: value,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   const editorFunctions = useMemo(
//     () => ({
//       handleSelect: (type: EditorFunction) => {
//         if (!editor) return;

//         switch (type) {
//           case "bold":
//             editor.chain().focus().toggleBold().run();
//             break;
//           case "italic":
//             editor.chain().focus().toggleItalic().run();
//             break;
//           case "underline":
//             editor.chain().focus().toggleUnderline().run();
//             break;
//           case "alignLeft":
//             editor.chain().focus().setTextAlign("left").run();
//             break;
//           case "alignCenter":
//             editor.chain().focus().setTextAlign("center").run();
//             break;
//           case "alignRight":
//             editor.chain().focus().setTextAlign("right").run();
//             break;
//           case "bullet":
//             editor.chain().focus().toggleBulletList().run();
//             break;
//           case "numbering":
//             editor.chain().focus().toggleOrderedList().run();
//             break;
//           case "color":
//             // editor.format('color', value); // 색상 선택기 구현 필요
//             break;
//         }
//       },
//     }),
//     [editor]
//   );

//   const handleLinkUrl = useCallback(() => {
//     setShowLinkInput(!showLinkInput);
//   }, [showLinkInput]);

//   return (
//     <>
//       <div className="flex flex-col gap-4 w-full h-screen">
//         <div className="flex justify-between">
//           <div className="flex justify-between gap-4">
//             <div className="flex items-center gap-1">
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   editorFunctions.handleSelect("bold");
//                 }}
//               >
//                 <Image
//                   src="/images/editor-icons/ic_bold.svg"
//                   alt="bold"
//                   width={22}
//                   height={22}
//                 />
//               </button>
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   editorFunctions.handleSelect("italic");
//                 }}
//               >
//                 <Image
//                   src="/images/editor-icons/ic_italic.svg"
//                   alt="italic"
//                   width={22}
//                   height={22}
//                 />
//               </button>
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   editorFunctions.handleSelect("underline");
//                 }}
//               >
//                 <Image
//                   src="/images/editor-icons/ic_underline.svg"
//                   alt="underline"
//                   width={22}
//                   height={22}
//                 />
//               </button>
//             </div>

//             <div className="flex items-center gap-1">
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   editorFunctions.handleSelect("alignLeft");
//                 }}
//               >
//                 <Image
//                   src="/images/editor-icons/ic_Alignment_left.svg"
//                   alt="Alignment_left"
//                   width={22}
//                   height={22}
//                 />
//               </button>
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   editorFunctions.handleSelect("alignCenter");
//                 }}
//               >
//                 <Image
//                   src="/images/editor-icons/ic_Alignment_center.svg"
//                   alt="Alignment_center"
//                   width={22}
//                   height={22}
//                 />
//               </button>
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   editorFunctions.handleSelect("alignRight");
//                 }}
//               >
//                 <Image
//                   src="/images/editor-icons/ic_Alignment_right.svg"
//                   alt="Alignment_right"
//                   width={22}
//                   height={22}
//                 />
//               </button>
//             </div>

//             <div className="flex items-center gap-1">
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   editorFunctions.handleSelect("bullet");
//                 }}
//               >
//                 <Image
//                   src="/images/editor-icons/ic_bullet.svg"
//                   alt="bullet"
//                   width={22}
//                   height={22}
//                 />
//               </button>
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   editorFunctions.handleSelect("numbering");
//                 }}
//               >
//                 <Image
//                   src="/images/editor-icons/ic_numbering.svg"
//                   alt="numbering"
//                   width={22}
//                   height={22}
//                 />
//               </button>
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   editorFunctions.handleSelect("color");
//                 }}
//               >
//                 <Image
//                   src="/images/editor-icons/ic_coloring.svg"
//                   alt="coloring"
//                   width={22}
//                   height={22}
//                 />
//               </button>
//             </div>
//           </div>

//           <button type="button" onClick={handleLinkUrl}>
//             <Image
//               src="/images/editor-icons/ic_link.svg"
//               alt="link"
//               width={22}
//               height={22}
//             />
//           </button>
//         </div>

//         <hr className="border-t border-slate-200" />

//         {showLinkInput && (
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="링크를 입력해주세요"
//               className=" w-full bg-slate-200 rounded-[20px] px-10 py-1 placeholder:text-sm text-slate-800 font-normal"
//               {...register("linkUrl", {
//                 required: "링크를 입력해주세요",
//               })}
//             />
//             <div className="absolute left-2 top-1/2 -translate-y-1/2 ">
//               <Image
//                 src="/images/linkUrl.svg"
//                 alt="link"
//                 width={22}
//                 height={22}
//               />
//             </div>
//           </div>
//         )}

//         <div className="flex-1 w-full overflow-y-auto">
//           <EditorContent
//             editor={editor}
//             className="h-full w-full min-h-[calc(100vh-200px)] prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none p-4"
//           />
//         </div>
//       </div>
//     </>
//   );
// }

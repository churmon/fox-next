// // components/create-post-form.tsx
// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { createPost } from "@/actions/posts";

// interface ChecklistItem {
//   label: string;
//   checked: boolean;
// }

// export default function CreatePostForm() {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();

//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [images, setImages] = useState<File[]>([]);
//   const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
//   const [newItemLabel, setNewItemLabel] = useState("");
//   const [error, setError] = useState("");

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []);
//     if (images.length + files.length > 10) {
//       setError("Max 10 images allowed");
//       return;
//     }
//     setError("");
//     setImages((prev) => [...prev, ...files]);
//   };

//   const removeImage = (index: number) =>
//     setImages((prev) => prev.filter((_, i) => i !== index));

//   const addChecklistItem = () => {
//     if (!newItemLabel.trim()) return;
//     setChecklist((prev) => [...prev, { label: newItemLabel, checked: false }]);
//     setNewItemLabel("");
//   };

//   const toggleChecklistItem = (index: number) =>
//     setChecklist((prev) =>
//       prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
//     );

//   const removeChecklistItem = (index: number) =>
//     setChecklist((prev) => prev.filter((_, i) => i !== index));

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("body", body);
//     formData.append("checklist", JSON.stringify(checklist));
//     images.forEach((file) => formData.append("images", file));

//     startTransition(async () => {
//       const result = await createPost(formData);
//       if (result?.error) {
//         setError(result.error);
//         return;
//       }
//       router.push(`/posts/${result.postId}`);
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
//       <input
//         type="text"
//         placeholder="Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full border rounded p-2"
//         required
//       />

//       <textarea
//         placeholder="What's on your mind?"
//         value={body}
//         onChange={(e) => setBody(e.target.value)}
//         className="w-full border rounded p-2 min-h-30"
//         required
//       />

//       <div>
//         <label className="block mb-1 font-medium">Images (up to 10)</label>
//         <input type="file" accept="image/*" multiple onChange={handleImageChange} />
//         <div className="flex flex-wrap gap-2 mt-2">
//           {images.map((file, i) => (
//             <div key={i} className="relative">
//               <img src={URL.createObjectURL(file)} alt="" className="w-20 h-20 object-cover rounded" />
//               <button
//                 type="button"
//                 onClick={() => removeImage(i)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div>
//         <label className="block mb-1 font-medium">Checklist</label>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={newItemLabel}
//             onChange={(e) => setNewItemLabel(e.target.value)}
//             placeholder="Add an item"
//             className="flex-1 border rounded p-2"
//           />
//           <button type="button" onClick={addChecklistItem} className="px-3 border rounded">
//             Add
//           </button>
//         </div>
//         <ul className="mt-2 space-y-1">
//           {checklist.map((item, i) => (
//             <li key={i} className="flex items-center gap-2">
//               <input type="checkbox" checked={item.checked} onChange={() => toggleChecklistItem(i)} />
//               <span className={item.checked ? "line-through text-gray-400" : ""}>{item.label}</span>
//               <button type="button" onClick={() => removeChecklistItem(i)} className="text-red-500 text-sm ml-auto">
//                 remove
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <button type="submit" disabled={isPending} className="bg-black text-white rounded px-4 py-2">
//         {isPending ? "Posting..." : "Post"}
//       </button>
//     </form>
//   );
// }
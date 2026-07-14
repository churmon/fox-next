// components/create-post-form.tsx
"use client";

import { useState, useTransition, type ChangeEvent, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const equipmentOptions = [
  "Spare wheel",
  "Jack",
  "Wheel brace",
  "Triangle",
  "Tow rope",
  "Fire extinguisher",
  "First aid kit",
] as const;

type EquipmentState = Record<(typeof equipmentOptions)[number], boolean>;

export default function CreatePostForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [driverName, setDriverName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [equipment, setEquipment] = useState<EquipmentState>(
    Object.fromEntries(equipmentOptions.map((option) => [option, false])) as EquipmentState
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 10) {
      setError("Max 10 images allowed");
      return;
    }

    // if (images.length + files.length > 10) {
    //   setError("Max 10 images allowed");
    //   return;
    // }
    setError("");
    const newFiles = files.filter((file) => file.size > 0);
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleEquipmentItem = (label: (typeof equipmentOptions)[number]) =>
    setEquipment((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("driverName", driverName);
    formData.append("regNumber", regNumber);
    formData.append("details", details);

    const selectedEquipment = equipmentOptions.filter((option) => equipment[option]);
    formData.append("equipment", JSON.stringify(selectedEquipment));
    images.forEach((file) => formData.append("images", file));

  // perform async upload, then use startTransition for the navigation
  (async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/create`, {
        method: "POST",
        body: formData,
        credentials: "include", // important for Better Auth cookies
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        setError(data.error || "Failed to save");
        return;
      }

      toast.success("Vehicle check saved successfully");
      startTransition(() => {
        router.push(`/`);
      });
    } catch (err) {
      setError("Something went wrong");
    }
  })();

    // startTransition(async () => {
      // const result = await createPost(formData);
      // if (result?.error) {
      //   setError(result.error);
      //   return;
      // }
      // router.push(`/posts/${result.postId}`);
      // router.push(`/`);
    // });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-5 rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold ">Vehicle check form</h2>
        <p className="text-sm ">
          Fill in the driver and vehicle details, confirm the emergency kit items, and add optional photos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium ">
            Driver name <span className="text-slate-400">(optional)</span>
          </span>
          <input
            type="text"
            placeholder="Enter driver name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Registration number</span>
          <input
            type="text"
            placeholder="Enter registration number"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            required
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium ">
          Details <span className="text-slate-400">(optional)</span>
        </span>
        <textarea
          placeholder="Add any notes or observations"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
      </label>

      <div className="space-y-3">
        <p className="text-sm font-medium">Emergency kit checklist</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {equipmentOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm "
            >
              <input
                type="checkbox"
                checked={equipment[option]}
                onChange={() => toggleEquipmentItem(option)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium ">Images (up to 10, optional)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="block w-full text-sm  file:mr-3 file:rounded-full file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
        />
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative">
                <img src={previewUrls[index]} alt="" className="h-20 w-20 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={isPending} className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70">
        {isPending ? "Saving..." : "Save vehicle check"}
      </button>
    </form>
  );
}
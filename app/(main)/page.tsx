import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export interface VehicleCheck {
  _id: string;
  userId: string;
  driverName?: string;
  regNumber: string;
  details?: string;
  images: string[];       // Cloudinary URLs
  checklist: string[];    // Emergency kit items
  createdAt: string;
  updatedAt: string;
}
// NEXT_PUBLIC_API_URL

export default async function Home() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vehicle`, {
    method: "GET",
    cache: "no-store",          // always fresh data
    credentials: "include",     // include Better Auth cookies
  });

  //  console.log("res", res.json());

  if (!res.ok) {
    return <p className="text-red-500">Failed to load vehicle checks</p>;
  }

    const posts: VehicleCheck[] = await res.json();
    // const posts = result.success ? result.checks : [] ;

    if(!posts.length)
    {
      return <div className="p-4">No posts found.</div>;
    }
    
    
  
    return (
      <div className=" p-6 space-y-6">
        <h1 className="text-2xl font-bold">My Vehicle Checks</h1>
        <ul className="grid space-y-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="border rounded-lg p-4 shadow-sm "
            >
              <h2 className="text-lg font-semibold">{post.driverName}</h2>
              <h2 className="text-lg font-semibold">{post.regNumber}</h2>
              <p className="text-gray-700 whitespace-pre-line">{post.details}</p>
  
              {/* {post.images?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.images.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="Vehicle check image"
                      className="w-32 h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )} */}

              {
  post.images?.length > 0 && (
    <div className="space-y-3">
      <Carousel className="w-full">
        <CarouselContent>
          {post.images.map((url, index) => (
            <CarouselItem key={url}>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
                <Image
                  src={url}
                  alt={`Post image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {post.images.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>

      {/* Image counter */}
      {post.images.length > 1 && (
        <div className="flex justify-center gap-2">
          {post.images.map((_, index) => (
            <div
              key={index}
              className="h-2 w-2 rounded-full bg-muted-foreground/40"
            />
          ))}
        </div>
      )}
    </div>
  )
}
  
              {post.checklist?.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm">
                  {
                  
                  post.checklist.map((item, idx) => {
                     // 1. Create a fallback object for plain text strings
  let parsed = { label: item, checked: false };

  try {
    // 2. Try to parse it in case it is a JSON string
    if (typeof item === "string" && (item.startsWith("{") || item.startsWith("["))) {
      parsed = JSON.parse(item);
    } else if (typeof item === "object" && item !== null) {
      // 3. In case the database already returned it as a parsed object
      parsed = item;
    }
  } catch (e) {
    // 4. If JSON.parse fails, it defaults to the plain text fallback
    console.error("Failed to parse checklist item, using fallback:", item);
  }
                    return (
                      <li key={idx}>
                        {/* {parsed.label} {parsed.checked ? "✅" : "❌"} */}
                        {parsed.label} {parsed.checked ? "✅" : "✅"}
                      </li>
                    );
                  })}
                </ul> 
              )}
  
              <p className="text-x mt-2">
                {/* Updated: {new Date(post.updatedAt).toLocaleString()} */}
                {new Date(post.updatedAt).toLocaleString(undefined, {
  timeZone: 'Africa/Johannesburg' // Use your specific IANA time zone
})}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
}

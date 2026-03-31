import { MovieCast } from "@/types";
import Image from "next/image";

interface CastListProps {
  cast?: MovieCast[];
}

export default function CastList({ cast = [] }: CastListProps) {
  const getImageSrc = (path?: string) => {
    if (!path) return "/user-profile.svg";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return path;
    return "/" + path; // auto-fix bad data
  };

  return (
    <section className="w-full py-12 mt-0">
      <h2 className="text-3xl font-bold mb-8 text-white px-6 md:px-16">Cast</h2>

      <div className="px-6 md:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {cast.map((person, index) => (
            <div
              key={index}
              className="
                bg-[#111b2d] 
                p-6 
                rounded-2xl 
                flex 
                flex-col 
                justify-center 
                items-center 
                shadow-lg 
                hover:scale-[1.03] 
                transition 
                duration-300
              "
            >
              <div className="w-28 h-28 rounded-full overflow-hidden mb-4">
                <Image
                  src={getImageSrc(person.picture)}
                  alt={person.actor}
                  width={112}
                  height={112}
                  className="object-cover"
                />
              </div>

              <p className="text-white font-semibold text-lg text-center">
                {person.actor}
              </p>

              <p className="text-gray-400 text-sm text-center mt-1">
                {person.character}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

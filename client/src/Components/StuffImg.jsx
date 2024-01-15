import Image from "./Image";

export default function StuffImage({ stuff, index = 0, className = null }) {
  if (!stuff.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }
  return (
    <Image
      className={className}
      src={stuff.photos[index]}
      alt="photos"
    />
  );
}

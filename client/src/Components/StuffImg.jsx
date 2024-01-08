export default function StuffImage({ stuff, index = 0, className = null }) {
  if (!stuff.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }
  return (
    <img
      className={className}
      src={"http://localhost:4000/uploads/" + stuff.photos[index]}
      alt="photos"
    />
  );
}

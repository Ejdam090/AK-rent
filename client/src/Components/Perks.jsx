export default function Perks({ selected, onChange }) {
  function handleCheckBoxClick(e) {
    const { checked, name } = e.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedName) => selectedName !== name)]);
    }
    //onChange([...selected, name])
  }
  return (
    <>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grig-cols-6">
        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer  ">
          <input
            type="checkbox"
            checked={selected.includes("Spalinowy")}
            name="Spalinowy"
            onChange={handleCheckBoxClick}
          />
          <span>Spalinowy</span>
        </label>
        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer  ">
          <input
            type="checkbox"
            checked={selected.includes("Elektryczny")}
            name="Elektryczny"
            onChange={handleCheckBoxClick}
          />
          <span>Elektryczny</span>
        </label>
        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer  ">
          <input
            type="checkbox"
            checked={selected.includes("Akumulator")}
            name="Akumulator"
            onChange={handleCheckBoxClick}
          />
          <span>Akumulator</span>
        </label>
        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer  ">
          <input
            type="checkbox"
            checked={selected.includes("Mały sprzęt")}
            name="Mały sprzęt"
            onChange={handleCheckBoxClick}
          />
          <span>Mały sprzęt</span>
        </label>
        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer  ">
          <input
            type="checkbox"
            checked={selected.includes("Średni sprzęt")}
            name="Średni sprzęt"
            onChange={handleCheckBoxClick}
          />
          <span>Średni sprzęt</span>
        </label>
        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer  ">
          <input
            type="checkbox"
            checked={selected.includes("Duży sprzęt")}
            name="Duży sprzęt"
            onChange={handleCheckBoxClick}
          />
          <span>Duży sprzęt</span>
        </label>
      </div>
    </>
  );
}

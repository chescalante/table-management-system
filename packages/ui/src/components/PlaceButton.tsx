export default function PlaceButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-800 min-h-16 flex-grow text-white rounded-md px-3 py-2 w-full transition-all duration-100 active:scale-95"
    >
      {label}
    </button>
  );
}

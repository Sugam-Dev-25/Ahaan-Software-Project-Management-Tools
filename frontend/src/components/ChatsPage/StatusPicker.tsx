import { STATUS_META, type UserStatus } from "../utils/userStatus";

interface Props {
  onSelect: (status: UserStatus) => void;
  onClose: () => void;
}

export default function StatusPicker({ onSelect, onClose }: Props) {
  return (
    <div className="absolute bottom-20 left-4 bg-black border border-gray-800 rounded-xl p-2 shadow-xl z-50 w-56">
      {Object.entries(STATUS_META).map(([key, meta]) => (
        <button
          key={key}
          onClick={() => {
            onSelect(key as UserStatus);
            onClose();
          }}
          className="
            flex items-center gap-3
            w-full px-3 py-2
            hover:bg-gray-800
            rounded-lg
            transition
          "
        >
          {/* 🔥 SLACK-STYLE EMOJI */}
          <span className="text-xl select-none drop-shadow">
            {meta.emoji}
          </span>

          <span className="text-sm">{meta.label}</span>
        </button>
      ))}

      {/* CLEAR */}
      <button
        onClick={() => {
          onSelect(null);
          onClose();
        }}
        className="
          w-full text-left
          px-3 py-2 mt-1
          text-xs text-gray-400
          hover:text-white
        "
      >
        Clear Status
      </button>
    </div>
  );
}

const colorCombos = [
  {
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  {
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  {
    bg: "bg-lime-50",
    border: "border-lime-200",
  },
  {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

export const getRandomColorCombo = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorCombos.length;
  return colorCombos[index];
};

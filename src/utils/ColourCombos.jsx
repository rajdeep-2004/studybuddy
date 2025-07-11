const colorCombos = [
  {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  {
    bg: "bg-lime-50",
    text: "text-lime-700",
    border: "border-lime-200",
  },
  {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
];

export const getRandomColorCombo = () => {
  const index = Math.floor(Math.random() * colorCombos.length);
  return colorCombos[index];
};

export const getColorByKey = (key) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorCombos.length;
  return colorCombos[index];
};

export default colorCombos;

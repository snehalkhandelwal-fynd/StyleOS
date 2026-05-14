import Svg, { Circle, Path } from "react-native-svg";

export function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Circle
        cx={9.1667}
        cy={9.1667}
        r={5.8333}
        stroke="#5A5A5A"
        strokeWidth={1.5}
      />
      <Path
        d="M13.3334 13.3333L16.6667 16.6667"
        stroke="#5A5A5A"
        strokeLinecap="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

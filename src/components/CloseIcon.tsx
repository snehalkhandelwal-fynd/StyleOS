import Svg, { Path } from "react-native-svg";

export function CloseIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6L18 18M18 6L6 18"
        stroke="#141414"
        strokeLinecap="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
}

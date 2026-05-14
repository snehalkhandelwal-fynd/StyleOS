import Svg, { Path } from "react-native-svg";

type HeartIconProps = {
  color?: string;
};

export function HeartIcon({ color = "#FFFFFF" }: HeartIconProps) {
  return (
    <Svg width={25} height={24} viewBox="0 0 25 24" fill="none">
      <Path
        d="M12.5 20.25C12.5 20.25 4.25 15.75 4.25 9.75C4.25 7.26 6.26 5.25 8.75 5.25C10.18 5.25 11.53 5.94 12.5 7.04C13.47 5.94 14.82 5.25 16.25 5.25C18.74 5.25 20.75 7.26 20.75 9.75C20.75 15.75 12.5 20.25 12.5 20.25Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
      />
    </Svg>
  );
}

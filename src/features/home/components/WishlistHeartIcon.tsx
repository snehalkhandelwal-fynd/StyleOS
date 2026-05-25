import Svg, { Path } from "react-native-svg";

import { colors } from "../../../theme";

const wishlistHeartColor = "#D92D20";

type WishlistHeartIconProps = {
  saved: boolean;
  size?: number;
};

export function WishlistHeartIcon({
  saved,
  size = 16
}: WishlistHeartIconProps) {
  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41699C18.3879 3.14032 17.6725 2.99776 16.95 2.99776C16.2275 2.99776 15.5121 3.14032 14.8446 3.41699C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.99871 7.05 2.99871C5.59097 2.99871 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.033 10.6054C22.3097 9.93789 22.4522 9.22249 22.4522 8.5C22.4522 7.77751 22.3097 7.0621 22.033 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"
        fill={saved ? wishlistHeartColor : "none"}
        stroke={saved ? wishlistHeartColor : colors.text}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

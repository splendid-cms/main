import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FunctionComponent, PropsWithChildren, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { Header } from "./header/component";
import { Navbar } from "./navbar/component";
import { RouterTransition } from "./progress/component";

export const PanelProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const mobile = useMediaQuery("(max-width: 900px)");
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    (getCookie("color-scheme") as ColorScheme)
  );

  const toggleColorScheme = (value?: ColorScheme): void => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    // When color scheme is updated save it to cookie
    setCookie("color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: true,
    });
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        withCSSVariables
        theme={{
          colorScheme,
          primaryColor: "splendid-green",
          primaryShade: 9,
          colors: {
            "splendid-green": [
              "#F1F6EC",
              "#E4EDD8",
              "#D6E4C5",
              "#C8DBB1",
              "#BBD29E",
              "#ADC88B",
              "#9FBF77",
              "#91B664",
              "#76A43D",
              "#567E2D",
            ],
            "purple-heart": [
              "#F0ECF6",
              "#E1D8ED",
              "#D3C5E4",
              "#C4B1DB",
              "#B59ED2",
              "#A68BC8",
              "#9777BF",
              "#8964B6",
              "#6B3DA4",
              "#563183",
            ],
            dark: [
              "#C1C2C5",
              "#95969B",
              "#818388",
              "#53555C",
              "#32343A",
              "#28292E",
              "#212227",
              "#17181B",
              "#121315",
              "#0E0F11",
            ],
          },
        }}
      >
        <RouterTransition />
        <AppShell header={mobile && <Header />} navbar={!mobile && <Navbar />}>
          {children}
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

import React from "react";
import { OffthreadVideo, staticFile, AbsoluteFill } from "remotion";
import { Scene as SceneType, FPS } from "./config";
import { ColorGrade } from "./effects/ColorGrade";
import { KenBurns } from "./effects/KenBurns";
import { KineticText } from "./effects/KineticText";
import { SceneTransition } from "./effects/SceneTransition";
import { FilmGrain, LightLeak, Scrim, Vignette } from "./effects/CinematicFX";
import { AnimatedCounter } from "./graphics/AnimatedCounter";
import { PercentCircle } from "./graphics/PercentCircle";
import { BarChart } from "./graphics/BarChart";
import { ClipPlaceholder } from "./graphics/ClipPlaceholder";
import { DataBackground } from "./graphics/DataBackground";

export const Scene: React.FC<{ scene: SceneType; index?: number }> = ({
  scene,
  index = 0,
}) => {
  const durationInFrames = Math.round(scene.durationInSeconds * FPS);

  const content = (() => {
    if (scene.type === "clip") {
      return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
          <ColorGrade style={scene.colorGrade ?? "teal-orange"}>
            <KenBurns
              mode={scene.kenBurns ?? "in"}
              durationInFrames={durationInFrames}
              seed={index}
            >
              {scene.clipSrc ? (
                <OffthreadVideo
                  src={staticFile(scene.clipSrc)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <ClipPlaceholder colorGrade={scene.colorGrade ?? "teal-orange"} />
              )}
            </KenBurns>
          </ColorGrade>
          {/* Overlays cinematograficos sobre el clip */}
          <LightLeak />
          <Scrim />
          {scene.caption && (
            <KineticText text={scene.caption} highlightWord="" />
          )}
        </AbsoluteFill>
      );
    }

    // type === "data"
    return (
      <AbsoluteFill>
        <DataBackground />
        {scene.data?.kind === "counter" && (
          <AnimatedCounter
            value={scene.data.value}
            label={scene.data.label}
            prefix={scene.data.prefix}
            suffix={scene.data.suffix}
          />
        )}
        {scene.data?.kind === "percent" && (
          <PercentCircle value={scene.data.value} label={scene.data.label} />
        )}
        {scene.data?.kind === "bars" && (
          <BarChart label={scene.data.label} items={scene.data.items} />
        )}
      </AbsoluteFill>
    );
  })();

  return (
    <SceneTransition type={scene.transitionIn ?? "none"}>
      {content}
      {/* Grano + viñeteado global para unificar el look de toda escena */}
      <Vignette strength={0.5} />
      <FilmGrain />
    </SceneTransition>
  );
};

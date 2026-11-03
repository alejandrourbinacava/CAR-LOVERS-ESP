import React from "react";
import { Composition } from "remotion";
import { CarVideo } from "./CarVideo";
import { videoConfig } from "./config";
import { StyleTest } from "./StyleTest";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="CarVideo"
        component={CarVideo}
        durationInFrames={Math.max(
          1,
          Math.round(videoConfig.totalDurationInSeconds * videoConfig.fps)
        )}
        fps={videoConfig.fps}
        width={videoConfig.width}
        height={videoConfig.height}
      />
      <Composition id="StyleTest" component={StyleTest} durationInFrames={300} fps={30} width={1920} height={1080} />
    </>
  );
};

import React from "react";
import { Composition } from "remotion";
import { CarVideo } from "./CarVideo";
import { videoConfig } from "./config";

export const Root: React.FC = () => {
  return (
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
  );
};

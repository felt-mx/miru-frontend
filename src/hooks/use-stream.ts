"use client";

import { RefObject, useEffect, useRef } from "react";
import { useSharedSocket } from "@/hooks/use-shared-socket";
import { StreamType } from "@/lib/stream-types";

const FRAME_INTERVAL_MS = 3000;
const MAX_FRAME_WIDTH = 1280;
const JPEG_QUALITY = 0.8;
const TARGET_PREVIEW_FPS = 60;

export type Options = {
  url: string;
  streamType: StreamType;
  previewRef?: RefObject<HTMLVideoElement | null>;
};

export function useStream({ url, streamType, previewRef }: Options) {
  const { socket } = useSharedSocket(url);
  const socketRef = useRef<typeof socket>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    let isActive = true;

    const clearFrameInterval = () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    };

    const stopStream = () => {
      clearFrameInterval();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }

      if (previewRef?.current) {
        previewRef.current.pause();
        previewRef.current.srcObject = null;
      }
    };

    const emitFrame = () => {
      const video = videoRef.current;

      if (!video || !video.videoWidth || !video.videoHeight) return;

      const canvas = canvasRef.current ?? document.createElement("canvas");
      canvasRef.current = canvas;

      const scale = Math.min(1, MAX_FRAME_WIDTH / video.videoWidth);
      canvas.width = Math.max(1, Math.floor(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.floor(video.videoHeight * scale));

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

      socket.emit("send_frame", {
        frame,
      });
    };

    const startStream = async () => {
      if (streamType === "none") {
        stopStream();
        return;
      }

      try {
        stopStream();

        const mediaStream =
          streamType === "camera"
            ? await navigator.mediaDevices.getUserMedia({
                video: {
                  frameRate: {
                    ideal: TARGET_PREVIEW_FPS,
                    max: TARGET_PREVIEW_FPS,
                  },
                },
                audio: false,
              })
            : await navigator.mediaDevices.getDisplayMedia({
                video: {
                  frameRate: {
                    ideal: TARGET_PREVIEW_FPS,
                    max: TARGET_PREVIEW_FPS,
                  },
                },
                audio: false,
              });

        if (!isActive) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;

        const [videoTrack] = mediaStream.getVideoTracks();
        if (videoTrack) {
          videoTrack.onended = () => {
            stopStream();
          };
        }

        if (!videoRef.current) {
          const videoEl = document.createElement("video");
          videoEl.autoplay = true;
          videoEl.muted = true;
          videoEl.playsInline = true;
          videoRef.current = videoEl;
        }

        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();

        if (previewRef?.current) {
          previewRef.current.srcObject = mediaStream;
          await previewRef.current.play();
        }

        emitFrame();
        frameIntervalRef.current = setInterval(emitFrame, FRAME_INTERVAL_MS);
      } catch (error) {
        console.error("[Stream] Failed to start stream:", error);
        stopStream();
      }
    };

    void startStream();

    return () => {
      isActive = false;
      stopStream();
    };
  }, [socket, streamType, previewRef]);
}

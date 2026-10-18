"use client";

import * as React from "react";
import { Layout, Fit, Alignment, RuntimeLoader, useRive } from "@rive-app/react-canvas";
import { withBasePath } from "@/lib/site";

// Self-host the runtime (copied by `postinstall`) instead of the default unpkg CDN.
RuntimeLoader.setWasmUrl(withBasePath("/rive/rive.wasm"));

type Props = {
  src: string;
  stateMachine?: string;
  /** Autoplay a linear animation (looping per the file) instead of a state machine. */
  animation?: string;
  /** Seconds advanced each frame, and each loop restart, so the page can sync UI to playback. */
  onAdvance?: (seconds: number) => void;
  onLoop?: () => void;
  artboard?: string;
  inputs?: Record<string, number | boolean>;
  triggers?: Record<string, number>;
  ariaLabel?: string;
  onError: () => void;
};

/** Loaded on demand by RiveScene so the runtime stays out of the main bundle. */
export function RivePlayer({
  src,
  stateMachine,
  animation,
  onAdvance,
  onLoop,
  artboard,
  inputs,
  triggers,
  ariaLabel,
  onError,
}: Props) {
  const advanceRef = React.useRef(onAdvance);
  const loopRef = React.useRef(onLoop);
  advanceRef.current = onAdvance;
  loopRef.current = onLoop;
  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    ...(animation ? { animations: animation } : { stateMachines: stateMachine }),
    autoplay: true,
    onAdvance: (e) => advanceRef.current?.(e.data as number),
    onLoop: () => loopRef.current?.(),
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: onError,
  });

  React.useEffect(() => {
    if (!rive || !inputs || !stateMachine) return;
    for (const input of rive.stateMachineInputs(stateMachine) ?? []) {
      if (input.name in inputs) input.value = inputs[input.name];
    }
  }, [rive, stateMachine, inputs]);

  // Looping scenes keep rendering off-screen otherwise; pause them while hidden.
  const box = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = box.current;
    if (!rive || !el) return;
    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? rive.play() : rive.pause()
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rive]);

  const fired = React.useRef<Record<string, number>>({});
  React.useEffect(() => {
    if (!rive || !triggers || !stateMachine) return;
    for (const input of rive.stateMachineInputs(stateMachine) ?? []) {
      const count = triggers[input.name];
      if (count === undefined) continue;
      if (fired.current[input.name] !== undefined && count !== fired.current[input.name]) {
        input.fire();
      }
      fired.current[input.name] = count;
    }
  }, [rive, stateMachine, triggers]);

  return (
    <div ref={box} className="h-full w-full">
      <RiveComponent role="img" aria-label={ariaLabel} className="h-full w-full" />
    </div>
  );
}

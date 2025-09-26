// =================================================================
// OMNI-FX: Live React Demo
// A real-world example of the OMNI-FX state machine icon system.
// This component demonstrates how to initialize and control Rive
// state machines in a modern React (Vite) application.
//
// Learn more at [www.omnifx.studio]
// =================================================================

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import "./App.css";

// THE FIX IS HERE: We now import the Rive file directly.
import RiveFile from './assets/omnifx_starter.riv';

// --- Rive Configuration ---
const ARTBOARD = "OMNI_MagicBoard";
const STATE_MACHINE = "StateMachine";

// --- State Definitions ---
const defaultState = {
  iconIndex: 2,
  colorStyle: 2,
  backgroundStyle: 0,
  hoverStyle: 1,
  gradientFill: 1,
  disabledState: 0,
};

const toggledState = {
  iconIndex: 3,
  colorStyle: 2,
  backgroundStyle: 0,
  hoverStyle: 1,
  gradientFill: 1,
  disabledState: 0,
};

export default function App() {
  // --- Rive Setup ---
  const { rive, RiveComponent } = useRive({
    // THE FIX IS HERE: We now use the imported file variable.
    src: RiveFile,
    artboard: ARTBOARD,
    stateMachines: STATE_MACHINE,
    autoplay: true,
  });

  // --- State Machine Input Hooks ---
  const iconIndexInput = useStateMachineInput(rive, STATE_MACHINE, "IconIndex");
  const colorStyleInput = useStateMachineInput(rive, STATE_MACHINE, "ColorStyle");
  const backgroundStyleInput = useStateMachineInput(rive, STATE_MACHINE, "BackgroundStyle");
  const hoverStyleInput = useStateMachineInput(rive, STATE_MACHINE, "HoverStyle");
  const gradientFillInput = useStateMachineInput(rive, STATE_MACHINE, "GradientFill");
  const disabledStateInput = useStateMachineInput(rive, STATE_MACHINE, "DisabledState");
  const clickTriggerInput = useStateMachineInput(rive, STATE_MACHINE, "ClickTrigger");

  // --- React State & Refs ---
  const [toggled, setToggled] = useState(false);
  const isInitialMount = useRef(true);

  // --- Core Logic: Applying State to Rive ---
  const applyState = useCallback((state) => {
    if (!rive || !iconIndexInput || !colorStyleInput || !backgroundStyleInput || !hoverStyleInput || !gradientFillInput || !disabledStateInput) return;
    
    iconIndexInput.value = state.iconIndex;
    colorStyleInput.value = state.colorStyle;
    backgroundStyleInput.value = state.backgroundStyle;
    hoverStyleInput.value = state.hoverStyle;
    gradientFillInput.value = state.gradientFill;
    disabledStateInput.value = state.disabledState;
  }, [rive, iconIndexInput, colorStyleInput, backgroundStyleInput, hoverStyleInput, gradientFillInput, disabledStateInput]);
  
  useEffect(() => {
    if (rive && clickTriggerInput) { 
      if (isInitialMount.current) {
        applyState(defaultState);
        clickTriggerInput.fire();
        isInitialMount.current = false;
      } else {
        applyState(toggled ? toggledState : defaultState);
        clickTriggerInput.fire();
      }
    }
  }, [toggled, rive, clickTriggerInput, applyState]);

  const handleRiveClick = () => setToggled(!toggled);

  // --- Render ---
  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1 className="title">OMNI-FX</h1>
        <p className="subtitle">
          Interactive icon preview — click on the icon tile
        </p>
      </header>

      <div className="app-container">
        {/* Left Panel: UI Mockup */}
        <main className="left-panel">
          <div className="placeholder header">
            <div className="mock-ui-label">Display Settings</div>
          </div>
          <div className="placeholder subheader">
            <div className="mock-ui-label">Appearance</div>
          </div>
          <div className="placeholder line">
             <div className="mock-ui-label">Theme</div>
          </div>
          <div className="placeholder line short">
             <div className="mock-ui-label">Accent Color</div>
          </div>
          <div className="placeholder line">
             <div className="mock-ui-label">Icon Style</div>
          </div>
          <div className="placeholder image-box">
             <div className="mock-ui-label">Theme Preview</div>
          </div>
          <div className="placeholder line">
            <div className="mock-ui-button">Save Changes</div>
          </div>
        </main>

        {/* Right Panel: Live Rive Component */}
        <aside className="right-panel">
          <div className="sidebar-title">Live Rive Component</div>
          <div
            className="rive-container"
            role="button"
            tabIndex={0}
            onClick={handleRiveClick}
            onKeyDown={(e) => (e.key === "Enter" ? handleRiveClick(e) : null)}
            aria-label="Omni icon preview (click to toggle)"
          >
            <RiveComponent />
          </div>
          <p className="sidebar-caption">This is not a GIF or a video. It's a real-time, state-aware component you can control with code.</p>
        </aside>
      </div>
    </div>
  );
}
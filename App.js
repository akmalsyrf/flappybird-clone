import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GameEngine } from "react-native-game-engine";

import entities from "./entities";
import Physics from "./physics";

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  useEffect(() => {
    setRunning(true);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" hidden />
      <GameEngine
        ref={(ref) => setGameEngine(ref)}
        systems={[Physics]}
        running={running}
        entities={entities()}
        onEvent={(e) => {
          switch (e.type) {
            case "game_over":
              setRunning(false);
              gameEngine.stop();
          }
        }}
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
      ></GameEngine>
    </View>
  );
}

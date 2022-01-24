import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GameEngine } from "react-native-game-engine";

import entities from "./entities";
import Physics from "./physics";

export default function App() {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    setRunning(false);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" hidden />
      <GameEngine systems={[Physics]} running={running} entities={entities()} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}></GameEngine>
    </View>
  );
}

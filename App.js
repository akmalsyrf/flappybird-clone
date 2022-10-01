import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GameEngine } from "react-native-game-engine";

import Background from "./src/assets/bg.jpg";

import { Dimensions } from "react-native";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

import entities from "./src/entities";
import Physics from "./src/Physics";

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [highestPoints, setHighestPoints] = useState(0);
  useEffect(() => {
    setRunning(false);
  }, []);

  useEffect(()=>{
    const storeData = async (value) =>{
      const storeHighestPoints = await AsyncStorageLib.getItem("@highestPoints")
      if(storeHighestPoints){
        if(storeHighestPoints < currentPoints){
          value = value++
          await AsyncStorageLib.setItem("@highestPoints", String(value))
          setHighestPoints(await AsyncStorageLib.getItem("@highestPoints"))
        }
      } else {
        await AsyncStorageLib.setItem("@highestPoints", "0")
        setHighestPoints(await AsyncStorageLib.getItem("@highestPoints"))
      }
    }

    storeData(Number(currentPoints))
  },[highestPoints, currentPoints])
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={Background} resizeMode="cover" style={{ flex: 1 }} />
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
              break;
            case "new_point":
              setCurrentPoints(currentPoints + 1);
              break;
          }
        }}
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
      >
        <StatusBar style="auto" hidden />
      </GameEngine>
      <Text style={{ fontSize: 40, fontWeight: "bold", margin: 20, position: "absolute", color: "white" }}>{currentPoints}</Text>
      <Text style={{ fontSize: 15, fontWeight: "bold", margin: 20, position: "absolute", right : 10, top : 10, color: "white" }}>Highest Points : {highestPoints}</Text>

      {/* start button */}
      {!running ? (
        <View style={{ position: "absolute", top: windowHeight / 2, left: windowWidth * 15/100 }}>
          <TouchableOpacity
            onPress={() => {
              setCurrentPoints(0);
              setRunning(true);
              gameEngine.swap(entities());
            }}
            style={{ backgroundColor: "brown", paddingHorizontal: 30, paddingVertical: 10 }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>START GAME</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

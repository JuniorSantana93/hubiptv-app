import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
   StyleSheet,
   Text,
   View,
   Image,
   TouchableHighlight,
   AsyncStorage,
   Alert,
   ActivityIndicator
} from "react-native";
import { Video } from "expo-av";
import { useFonts } from "expo-font";
import * as ExpoOrientation from "expo-screen-orientation";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Player({ route, navigation }) {
   let p = route.params;

   // States
   let [isPaused, setIsPaused] = useState(false);
   let [isFav, setIsFav] = useState(false);
   let [progress_bar_percent, setProgress_bar_percent] = useState(0);
   let [ControlsOpacity, setControlsOpacity] = useState(0);
   let [currentTime_, setCurrentTime_] = useState("00:00:00");
   let [duration_, setDuration_] = useState("00:00:00");
   let [isBuffering, setIsBuffering] = useState(true);
   let [intesc,setIntesc] = useState(null);

   // Effects
   useEffect(() => {
      ExpoOrientation.lockAsync(ExpoOrientation.OrientationLock.LANDSCAPE);

      // AsyncStorage
      AsyncStorage.getItem("@Hubiptv:Favs", async (err, res) => {
         if (err) return;
         if (res) {
            res = JSON.parse(res);
            let isf = false;
            res.forEach((e) => {
               if (e == p.name) {
                  isf = true;
               }
            });
            setIsFav(isf);
         } else {
            await AsyncStorage.setItem("@Hubiptv:Favs", JSON.stringify([]));
         }
      });

      return () => {
         ExpoOrientation.unlockAsync();
      };
   }, []);

   // Refs
   let video_dom = useRef(null);

   // Fonts
   let [fontsloaded] = useFonts({
      "Open-Sans": require("./assets/OpenSans-Regular.ttf"),
   });
   if (!fontsloaded) return <></>;

   // Functions
   function segundosParaHHMMSS(duration) {
      if (duration == undefined) return "00:00:00";
      let seconds = Math.floor((duration / 1000) % 60);
      let minutes = Math.floor((duration / (1000 * 60)) % 60);
      let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      return hours + ":" + minutes + ":" + seconds;
   }
   let pause = async () => {
      let { isPlaying } = await video_dom.current.getStatusAsync();

      if (isPlaying) {
         video_dom.current.pauseAsync();
         setIsPaused(true);
      } else {
         video_dom.current.playAsync();
         setIsPaused(false);
      }
   };
   let fav = async () => {
      let currentFavs = await AsyncStorage.getItem("@Hubiptv:Favs");
      if (currentFavs) {
         currentFavs = JSON.parse(currentFavs);
         let jt = false;
         currentFavs.forEach((e) => {
            if (e == p.name) {
               jt = true;
            }
         });

         if (jt) {
            let pos = currentFavs.indexOf(p.name);
            currentFavs.splice(pos, 1);
            setIsFav(false);
            Alert.alert("Removido!", p.name + " removido dos favoritos.");
         } else {
            currentFavs.push(p.name);
            setIsFav(true);
            Alert.alert("Adicionado!", p.name + " adicionado aos favoritos.");
         }

         await AsyncStorage.setItem(
            "@Hubiptv:Favs",
            JSON.stringify(currentFavs)
         );
      }
   };
   let back = async (segundos) => {
      let currentTime = await video_dom.current.getStatusAsync();
      if (!currentTime) return;
      currentTime = currentTime.positionMillis;
      video_dom.current.setPositionAsync(currentTime - segundos * 1000);
   };
   let go = async (segundos) => {
      let currentTime = await video_dom.current.getStatusAsync();
      if (!currentTime) return;
      currentTime = currentTime.positionMillis;
      video_dom.current.setPositionAsync(currentTime + segundos * 1000);
   };
   let updateProgressBar = async (status_) => {
      let currentTime = status_.positionMillis;
      let durationtime = status_.durationMillis;

      setProgress_bar_percent((currentTime / durationtime) * 100);

      // Current time
      setCurrentTime_(segundosParaHHMMSS(currentTime));
      setDuration_(segundosParaHHMMSS(durationtime));
   };
   let sControls = () => {
      if (intesc) {
         clearTimeout(intesc);
         setIntesc(null);
      }
      if (ControlsOpacity == 1) {
         setControlsOpacity(0);
      } else {
         setControlsOpacity(1);
      }
      setIntesc(setTimeout(() => {
         if (ControlsOpacity == 1) {
            setControlsOpacity(0);
         }
      }, 5000));
   };
   function pse(e) {
      updateProgressBar(e);
   }

   // Components
   let Button = (props) => {
      return (
         <Icon
            style={props.style}
            size={props.size}
            color={props.color}
            onPress={() => props.clickFunction()}
            name={props.name}
            backgroundColor="transparent"
            size={props.size}
            solid
         />
      );
   };

   return (
      <View style={styles.container}>
         <View
            onTouchEndCapture={() => sControls()}
            style={[styles.controls, { opacity: ControlsOpacity }]}
         >
            <View style={styles.shadow_top} />
            <View style={styles.shadow_down} />
            <View style={styles.top_controls}>
               <TouchableHighlight
                  onPress={() => navigation.goBack()}
                  style={[
                     styles.control_button,
                     { marginTop: 10, marginLeft: 10, height: 50, width: 50 },
                  ]}
               >
                  <View>
                     <Image
                        resizeMode={"contain"}
                        resizeMethod="resize"
                        style={styles.icon}
                        source={{ uri: p.image }}
                     />
                  </View>
               </TouchableHighlight>
               <Text style={styles.title}>
                  {p.name} - {p.group}
               </Text>
            </View>
            <View style={styles.mid}>
               <View style={styles.central_buttons}>
                  
               </View>
            </View>
            <View style={styles.bar}>
               <View style={styles.time}>
                  <Text style={styles.time_current}>{currentTime_}</Text>
                  <View style={styles._bar}>
                     <View
                        style={[
                           styles.progress_bar,
                           { width: progress_bar_percent + "%" },
                        ]}
                     ></View>
                  </View>
                  <Text style={styles.time_duration}>{duration_}</Text>
               </View>
               <View style={styles.bottomButtons}>
                  {isPaused ? (
                     <Button
                        name="play"
                        size={40}
                        color="white"
                        centerButton={true}
                        style={{ marginHorizontal: 15 }}
                        clickFunction={pause}
                     />
                  ) : (
                     <Button
                        name="pause"
                        size={40}
                        color="white"
                        centerButton={true}
                        style={{ marginHorizontal: 15 }}
                        clickFunction={pause}
                     />
                  )}
                  <Button
                     name="backward"
                     size={40}
                     color="white"
                     clickFunction={() => back(20)}
                     style={{ marginHorizontal: 15 }}
                  />
                  <Button
                     name="forward"
                     size={40}
                     color="white"
                     clickFunction={() => go(20)}
                     style={{ marginHorizontal: 15 }}
                  />
                  {isFav ? (
                     <Button
                        name="star"
                        size={40}
                        color="white"
                        centerButton={true}
                        style={{ marginHorizontal: 15 }}
                        clickFunction={fav}
                     />
                  ) : (
                     <Button
                        name="star-o"
                        size={40}
                        color="white"
                        centerButton={true}
                        style={{ marginHorizontal: 15 }}
                        clickFunction={fav}
                     />
                  )}
               </View>
            </View>
         </View>
         <Video
            isLooping
            source={{
               uri: p.url,
            }}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            style={styles.video}
            ref={video_dom}
            onPlaybackStatusUpdate={pse}
            onError={() =>
               Alert.alert(
                  "Error",
                  "O video não pode ser reproduzido no momento",
                  [{ text: "Ok", onPress: () => navigation.goBack() }]
               )
            }
         />
         <StatusBar hidden={true} />
      </View>
   );
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#000",
      alignItems: "center",
      justifyContent: "center",
   },
   video: {
      width: "100%",
      height: "100%",
   },
   controls: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 10,
   },
   top_controls: {
      width: "100%",
      height: "10%",
      alignItems: "center",
      flexDirection: "row",
      top: 0,
   },
   mid: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
   back_button: {
      marginLeft: 10,
      marginTop: 10,
      width: "10%",
      height: "100%",
      zIndex: 11,
   },
   title: {
      color: "white",
      marginTop: 8,
      marginLeft: 10,
      fontWeight: "bold",
      fontSize: 20,
      fontFamily: "Open-Sans",
   },
   icon: {
      height: "100%",
      width: "100%",
   },
   control_button: {
      justifyContent: "center",
      alignContent: "center",
      borderRadius: 100,
      padding: 10,
   },
   central_buttons: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
   },
   bar: {
      width: "100%",
      height: "20%",
   },
   _bar: {
      backgroundColor: "grey",
      width: "80%",
      height: 2,
      top: 0,
   },
   progress_bar: {
      backgroundColor: "red",
      height: "100%",
   },
   shadow_top: {
      backgroundColor: "black",
      width: "100%",
      height: "12%",
      position: "absolute",
      opacity: 0.5,
   },
   shadow_down: {
      backgroundColor: "black",
      width: "100%",
      height: "20%",
      position: "absolute",
      bottom: 0,
      opacity: 0.5,
   },
   bottomButtons: {
      flexDirection: "row",
      marginTop: 3,
   },
   time: {
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
   },
   time_current: {
      color: "white",
      marginLeft: 10,
   },
   time_duration: {
      color: "white",
      marginRight: 10,
   }
});

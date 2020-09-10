import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
   StyleSheet,
   Text,
   View,
   Image,
   TouchableHighlight
} from "react-native";
import { Video } from "expo-av";
import { useFonts } from "expo-font";
import * as ExpoOrientation from 'expo-screen-orientation';

export default function Player({ route, navigation }) {
   let p = route.params;

   let imgs = {
      pause: require("./assets/pause.png"),
      play: require("./assets/play-button.png"),
      back: require("./assets/return.png"),
      go: require("./assets/go.png"),
   };

   // States
   let [playImg, setPlayImg] = useState(imgs.pause);
   let [progress_bar_percent, setProgress_bar_percent] = useState(0);
   let [ControlsOpacity, setControlsOpacity] = useState(0);

   // Effects
   useEffect(()=>{
      ExpoOrientation.lockAsync(ExpoOrientation.OrientationLock.LANDSCAPE);

      return ()=>{
         ExpoOrientation.unlockAsync();
      }
   })

   // Refs
   let video_dom = useRef(null);

   // Fonts
   let [fontsloaded] = useFonts({
      "Open-Sans": require("./assets/OpenSans-Regular.ttf"),
   });
   if (!fontsloaded) return <></>;

   // Functions
   let pause = async () => {
      let { isPlaying } = await video_dom.current.getStatusAsync();

      if (isPlaying) {
         video_dom.current.pauseAsync();
         setPlayImg(imgs.play);
      } else {
         video_dom.current.playAsync();
         setPlayImg(imgs.pause);
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
   let updateProgressBar = async () => {
      let status_ = video_dom.current ? await video_dom.current.getStatusAsync() : null;
      if (!status_) return;
      let currentTime = status_.positionMillis;
      let durationtime = status_.durationMillis;

      setProgress_bar_percent((currentTime / durationtime) * 100);
   };
   let intesc;
   let sControls = () => {
      if(intesc) clearTimeout(intesc);
      updateProgressBar();
      setControlsOpacity(1);
      intesc = setTimeout(() => {
         setControlsOpacity(0);
      }, 5000);
   };

   // Components
   let Button = (props) => {
      return (
         <TouchableHighlight
            underlayColor="rgba(255,255,255,0.3)"
            style={[
               styles.control_button,
               {
                  height: props.height ? 60 + props.height : 60,
                  width: props.width ? 60 + props.width : 60,
                  marginLeft: props.centerButton ? 0 : 10,
               },
            ]}
            onPress={props.clickFunction}
         >
            <View>
               <Image
                  resizeMode={"contain"}
                  resizeMethod="resize"
                  style={styles.icon}
                  source={props.image}
               />
            </View>
         </TouchableHighlight>
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
                     { marginTop: 10, marginLeft: 10, height: 30, width: 30 },
                  ]}
               >
                  <View>
                     <Image
                        resizeMode={"contain"}
                        resizeMethod="resize"
                        style={styles.icon}
                        source={require("./assets/left-arrow.png")}
                     />
                  </View>
               </TouchableHighlight>
               <Text style={styles.title}>{p.name} - {p.group}</Text>
            </View>
            <View style={styles.mid}>
               <View style={styles.central_buttons}>
                  <Button
                     image={imgs.back}
                     centerButton={true}
                     height={10}
                     width={10}
                     clickFunction={() => back(20)}
                  />
                  <Button
                     image={playImg}
                     centerButton={true}
                     height={40}
                     width={40}
                     clickFunction={pause}
                  />
                  <Button
                     image={imgs.go}
                     centerButton={true}
                     height={10}
                     width={10}
                     clickFunction={() => go(20)}
                  />
               </View>
            </View>
            <View style={styles.bar}>
               <View style={styles._bar}>
                  <View
                     style={[
                        styles.progress_bar,
                        { width: progress_bar_percent + "%" },
                     ]}
                  ></View>
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
            onPlaybackStatusUpdate={()=>updateProgressBar()}
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
      width: "5%",
      height: "70%",
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
      height: 40,
   },
   _bar: {
      backgroundColor: "grey",
      width: "100%",
      height: 1,
   },
   progress_bar: {
      backgroundColor: "red",
      height: 1,
   },
   shadow_top: {
      backgroundColor: "black",
      width: "100%",
      height: "12%",
      position: "absolute",
      opacity: 0.5
   },
   shadow_down: {
      backgroundColor: "black",
      width: "100%",
      height: "13%",
      position: "absolute",
      bottom: 0,
      opacity: 0.5
   }
});

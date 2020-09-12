import React, { useState, useRef, useEffect } from "react";
import {
   StyleSheet,
   View,
   FlatList,
   Image,
   Text,
   TouchableHighlight,
   AsyncStorage,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function Favorites({ route, navigation }) {
   let p = route.params;
   let [isLoading, setIsLoading] = useState(true);
   let [currentList, setCurrentList] = useState(null);
   let [isEmpty, setIsEmpty] = useState(false);

   useEffect(() => {
      AsyncStorage.getItem("@Hubiptv:Favs", (err, res) => {
         if (err || !res) {
            setIsEmpty(true);
            return setIsLoading(false);
         }
         res = JSON.parse(res);
         let newList = [];
         p.list.forEach((e) => {
            let isFav = false;
            res.forEach((i) => {
               if (i == e.channel_name) {
                  isFav = true;
               }
            });
            if (isFav == true) newList.push(e);
         });
         setCurrentList(newList);
         if (newList.length == 0) setIsEmpty(true);
         setIsLoading(false);
      });
   }, []);

   function Body({ item }) {
      let e = item;
      return (
         <TouchableHighlight
            underlayColor='rgb(200,200,200)'
            onPress={() =>
               navigation.navigate("Player", {
                  url: e.video_url,
                  name: e.channel_name,
                  group: e.group,
                  image: e.img,
               })
            }
            style={styles.channel}>
            <>
               <Image
                  resizeMethod='resize'
                  resizeMode='contain'
                  source={{ uri: e.img }}
                  style={styles.channel_image}
               />
               <Text style={styles.channel_text}>{e.channel_name}</Text>
            </>
         </TouchableHighlight>
      );
   }

   if (isLoading) {
      return <></>
   };
   if (isEmpty)
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Icon name='sad-tear' size={40} color='black' />
            <Text>Vazio</Text>
         </View>
      );
   return (
      <View style={styles.all}>
         <FlatList
            style={styles.ScrollView}
            data={currentList}
            renderItem={Body}
            keyExtractor={(e) =>
               e.channel_name + Math.round(Math.random() * 37523)
            }
         />
      </View>
   );
}

const styles = StyleSheet.create({
   all: {
      flex: 1,
   },
   ScrollView: {
      flex: 1,
   },
   channel: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      height: 60,
      paddingHorizontal: 5,
      borderBottomColor: "black",
      borderBottomWidth: 0.3,
   },
   channel_image: {
      height: "90%",
      width: 60,
      backgroundColor: "rgb(210,210,210)",
   },
   channel_text: {},
});
